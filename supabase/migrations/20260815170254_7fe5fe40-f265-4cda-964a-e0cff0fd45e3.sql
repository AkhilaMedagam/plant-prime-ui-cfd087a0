DROP POLICY "Admins can delete submissions" ON public.contact_submissions;
DROP POLICY "Admins can update all submissions" ON public.contact_submissions;
DROP POLICY "Admins can view all submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view all submissions" ON public.contact_submissions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins can update all submissions" ON public.contact_submissions FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins can delete submissions" ON public.contact_submissions FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated, anon, PUBLIC;