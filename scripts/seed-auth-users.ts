import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const users = [
  {
    email: "retailer@reflex.demo",
    password: "ReflexDemo2026!",
    full_name: "Amina Otieno",
    phone: "0712345678",
    role: "retailer",
  },
  {
    email: "dispatcher@reflex.demo",
    password: "ReflexDemo2026!",
    full_name: "David Kamau",
    phone: "0722345678",
    role: "dispatcher",
  },
  {
    email: "rider1@reflex.demo",
    password: "ReflexDemo2026!",
    full_name: "Kevin Ochieng",
    phone: "0733345678",
    role: "rider",
  },
  {
    email: "rider2@reflex.demo",
    password: "ReflexDemo2026!",
    full_name: "Grace Wanjiku",
    phone: "0744345678",
    role: "rider",
  },
  {
    email: "admin@reflex.demo",
    password: "ReflexDemo2026!",
    full_name: "Brian Mwangi",
    phone: "0755345678",
    role: "admin",
  },
  {
    email: "superadmin@reflex.demo",
    password: "ReflexDemo2026!",
    full_name: "Reflex Super Admin",
    phone: "0766345678",
    role: "super_admin",
  },
];

async function main() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
      },
    });

    if (error) {
      console.error(`FAILED: ${user.email}`); console.error("Message:", error.message); console.error("Name:", error.name); console.error("Status:", error.status);
      continue;
    }

    console.log(`CREATED: ${user.email} → ${data.user?.id}`);
  }

  console.log("Auth provisioning complete.");
}

main().catch((error) => {
  console.error("Provisioning failed:", error);
  process.exit(1);
});