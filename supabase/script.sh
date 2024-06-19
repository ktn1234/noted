#!/usr/bin/env bash

# Initialize Supabase in your working directory
npx supabase init

# Create the note-created-push-notification edge function locally
npx supabase functions new note-created-push-notification
