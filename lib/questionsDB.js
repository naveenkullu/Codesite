import { supabase } from "./supabase";

// Fetch all posts with their code snippets
export async function getAllPosts() {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(`Failed to fetch posts: ${error.message}`);
  return data;
}

// Fetch a single post by ID
export async function getPostById(id) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw new Error(`Failed to fetch post: ${error.message}`);
  return data;
}

// Insert a new post with code
export async function insertPost(question, code) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase
    .from("posts")
    .insert([{ question, code }])
    .select()
    .single();
  
  if (error) throw new Error(`Failed to insert post: ${error.message}`);
  return data;
}

// Update a post
export async function updatePost(id, updates) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw new Error(`Failed to update post: ${error.message}`);
  return data;
}

// Delete a post
export async function deletePost(id) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);
  
  if (error) throw new Error(`Failed to delete post: ${error.message}`);
}

// Real-time subscription to posts
export function subscribeToPosts(callback) {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const subscription = supabase
    .from("posts")
    .on("*", (payload) => {
      callback(payload);
    })
    .subscribe();
  
  return subscription;
}
