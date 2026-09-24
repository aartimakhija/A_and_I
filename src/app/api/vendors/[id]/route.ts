import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const data: any = {};
  if (b.status) data.status = b.status; // PENDING | APPROVED | SUSPENDED
  if (b.commission !== undefined) data.commission = b.commission;
  if (b.moq !== undefined) data.moq = b.moq;
  if (b.leadTimeDays !== undefined) data.leadTimeDays = b.leadTimeDays;
  const v = await prisma.vendor.update({ where: { id: params.id }, data });
  return NextResponse.json(v);
}

// Deletes a vendor. Vendors are referenced from several places (products,
// materials, material orders, purchase orders, payouts, a vendor-portal
// login) so this can't be a blind delete:
//   - Real transactional history (purchase orders, payouts, a login) blocks
//     the delete outright — that data should never silently disappear via a
//     "clean up the vendor list" click. Suspend the vendor instead.
//   - Products / materials / material orders CAN be moved off this vendor
//     first ("unlink"), via `reassignTo` in the request body. If the vendor
//     still has any of these and no `reassignTo` is given, we tell the
//     caller exactly what's attached so the UI can ask which vendor to move
//     them to before deleting.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const { id } = params;
  const body = await req.json().catch(() => ({} as any));
  const reassignTo: string | undefined = body?.reassignTo || undefined;

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true, materials: true, materialOrders: true, purchaseOrders: true, payouts: true, users: true } },
    },
  });
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const blockers: string[] = [];
  if (vendor._count.purchaseOrders > 0) blockers.push(`${vendor._count.purchaseOrders} production order(s)`);
  if (vendor._count.payouts > 0) blockers.push(`${vendor._count.payouts} payment record(s)`);
  if (vendor._count.users > 0) blockers.push(`a vendor portal login`);
  if (blockers.length > 0) {
    return NextResponse.json(
      { error: `Can't delete — this vendor has ${blockers.join(", ")}. Suspend it instead of deleting.`, blockers },
      { status: 409 }
    );
  }

  const reassignable = vendor._count.products + vendor._count.materials + vendor._count.materialOrders;
  if (reassignable > 0) {
    if (!reassignTo) {
      return NextResponse.json(
        {
          needsReassign: true,
          counts: { products: vendor._count.products, materials: vendor._count.materials, materialOrders: vendor._count.materialOrders },
        },
        { status: 409 }
      );
    }
    if (reassignTo === id) {
      return NextResponse.json({ error: "Pick a different vendor to move these to." }, { status: 400 });
    }
    const target = await prisma.vendor.findUnique({ where: { id: reassignTo }, select: { id: true } });
    if (!target) return NextResponse.json({ error: "Target vendor not found." }, { status: 400 });

    await prisma.$transaction([
      prisma.product.updateMany({ where: { vendorId: id }, data: { vendorId: reassignTo } }),
      prisma.material.updateMany({ where: { vendorId: id }, data: { vendorId: reassignTo } }),
      prisma.materialOrder.updateMany({ where: { vendorId: id }, data: { vendorId: reassignTo } }),
      prisma.vendor.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true, reassigned: reassignable });
  }

  await prisma.vendor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
