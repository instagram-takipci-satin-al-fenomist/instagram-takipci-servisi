import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import type { CreateOrderInput, Order, Product } from "../domain.js";
import { rememberIdempotency } from "../utils/idempotency.js";

type Store = {
  orders: Record<string, Order>;
};

const storePath = path.join(process.cwd(), "orders.store.json");
let mem: Store = fs.existsSync(storePath)
  ? JSON.parse(fs.readFileSync(storePath, "utf8"))
  : { orders: {} };

function persist() {
  fs.writeFileSync(storePath, JSON.stringify(mem, null, 2));
}

export class OrderService {
  constructor(private products: Product[]) {}

  private getProduct(id: string): Product | null {
    return this.products.find(p => p.id === id) ?? null;
  }

  validateAndNormalize(input: CreateOrderInput): { product: Product; qty: number } {
    const product = this.getProduct(input.productId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");

    const { min_qty, max_qty, step } = product;
    if (input.quantity < min_qty || input.quantity > max_qty) throw new Error("INVALID_QUANTITY_RANGE");
    if (input.quantity % step !== 0) throw new Error("INVALID_QUANTITY_STEP");

    return { product, qty: input.quantity };
  }

  create(input: CreateOrderInput, idempotencyKey?: string | null): Order {
    const id = randomUUID();
    const now = new Date().toISOString();

    const order: Order = {
      id,
      productId: input.productId,
      quantity: input.quantity,
      link: input.link,
      externalId: input.externalId,
      status: "created",
      createdAt: now,
      updatedAt: now
    };

    mem.orders[id] = order;
    persist();

    if (idempotencyKey) rememberIdempotency(idempotencyKey, id);
    return order;
  }

  setStatus(id: string, status: Order["status"], extra: Partial<Order> = {}) {
    const o = mem.orders[id];
    if (!o) throw new Error("ORDER_NOT_FOUND");
    o.status = status;
    Object.assign(o, extra);
    o.updatedAt = new Date().toISOString();
    persist();
    return o;
  }

  get(id: string): Order | null {
    return mem.orders[id] ?? null;
  }
}
OrderService.ts
