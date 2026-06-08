import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function POST() {
  try {
    const supabase = await createClient();

    // Check auth session on the server
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "You must be logged in to delete your account." } },
        { status: 401 }
      );
    }

    // Initialize admin client with service_role key to delete the auth user
    const adminClient = createAdminClient();

    // Delete the user from auth.users (cascades to profiles, subscriptions, deck_reviews, review_messages)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Error deleting user via Admin API:", deleteError);
      return NextResponse.json(
        { error: { code: "DELETE_FAILED", message: deleteError.message || "Failed to delete auth user." } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Server error during account deletion:", error);
    const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message } },
      { status: 500 }
    );
  }
}
