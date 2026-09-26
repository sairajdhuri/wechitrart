import { createClient } from "@supabase/supabase-js";
import { Poster, Order } from "@/types";
import { INITIAL_POSTERS } from "@/data/initialPosters";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("your-project") &&
    !supabaseAnonKey.includes("your-anon-key")
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key for fallback/demo posters created in admin
const LOCAL_STORAGE_POSTERS_KEY = "wechitrart_custom_posters";
const LOCAL_STORAGE_ORDERS_KEY = "wechitrart_orders";

/**
 * Fetch all posters from Supabase with fallback to seed data + locally saved additions
 */
export async function getPosters(): Promise<Poster[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("posters")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Poster[];
      }
      if (error) {
        console.warn("Supabase query warning:", error.message);
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local dataset:", err);
    }
  }

  // Fallback to local catalog
  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(LOCAL_STORAGE_POSTERS_KEY);
      if (custom) {
        const parsedCustom: Poster[] = JSON.parse(custom);
        return [...parsedCustom, ...INITIAL_POSTERS];
      }
    } catch (e) {
      console.error("Local storage read error", e);
    }
  }

  return INITIAL_POSTERS;
}

/**
 * Insert a new poster into Supabase or fallback to local storage
 */
export async function createPoster(poster: Omit<Poster, "id" | "created_at">): Promise<Poster> {
  const newPoster: Poster = {
    ...poster,
    id: `pst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("posters")
        .insert([newPoster])
        .select()
        .single();

      if (!error && data) {
        return data as Poster;
      }
      console.warn("Supabase poster insert error, using local fallback:", error);
    } catch (err) {
      console.warn("Supabase createPoster exception:", err);
    }
  }

  // Local fallback
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_POSTERS_KEY);
      const parsed: Poster[] = existing ? JSON.parse(existing) : [];
      parsed.unshift(newPoster);
      localStorage.setItem(LOCAL_STORAGE_POSTERS_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error("Local storage write error", e);
    }
  }

  return newPoster;
}

/**
 * Delete a poster
 */
export async function deletePoster(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from("posters").delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete error", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_POSTERS_KEY);
      if (existing) {
        const parsed: Poster[] = JSON.parse(existing);
        const filtered = parsed.filter((p) => p.id !== id);
        localStorage.setItem(LOCAL_STORAGE_POSTERS_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error("Local storage delete error", e);
    }
  }

  return true;
}

/**
 * Record a new order in Supabase
 */
export async function recordOrder(order: Order): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from("orders").insert([
        {
          order_number: order.orderNumber,
          customer: order.customer,
          items: order.items,
          subtotal: order.subtotal,
          shipping_cost: order.shippingCost,
          total_amount: order.totalAmount,
          status: order.status,
        },
      ]);
      if (!error) return true;
      console.warn("Supabase order insert warning:", error);
    } catch (err) {
      console.warn("Supabase order insert failed:", err);
    }
  }

  // Local record for demo/admin view
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      const parsed: Order[] = existing ? JSON.parse(existing) : [];
      parsed.unshift(order);
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error("Order local storage write error", e);
    }
  }

  return true;
}

/**
 * Retrieve recent orders for Admin dashboard
 */
export async function getOrders(): Promise<Order[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          orderNumber: d.order_number,
          customer: d.customer,
          items: d.items,
          subtotal: Number(d.subtotal),
          shippingCost: Number(d.shipping_cost),
          totalAmount: Number(d.total_amount),
          status: d.status,
          createdAt: d.created_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch orders failed:", err);
    }
  }

  // Fallback to local storage
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (existing) {
        return JSON.parse(existing);
      }
    } catch (e) {
      console.error("Error loading local orders", e);
    }
  }

  return [];
}
