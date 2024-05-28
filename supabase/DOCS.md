Rate Limits for using Supabase's Email Service - https://supabase.com/docs/guides/auth/rate-limits
Email OTP Implementation - https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp
Resend an OTP - https://supabase.com/docs/reference/javascript/auth-resend

Steps to Delete a User on the Dashboard (https://supabase.com/dashboard/project/rawnmgnsjhwttrulabmi/auth/users)

1. Delete all of the user's notes in public.notes
2. Delete the user's profile which maps profile.user_id auth.users.id in public.profiles
3. Delete the user in the dashboard (https://supabase.com/dashboard/project/rawnmgnsjhwttrulabmi/auth/users)
