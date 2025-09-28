-- Insert test data for API testing
INSERT INTO users (id, email, name, full_name) VALUES 
('user_test', 'test@example.com', 'Test User', 'Test User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO workspaces (id, name, slug, primary_user_id) VALUES 
('workspace_test', 'Test Workspace', 'test-workspace', 'user_test')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clients (id, workspace_id, name, email) VALUES 
('client_test', 'workspace_test', 'Test Client', 'client@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO orders (id, workspace_id, client_id, order_number, stripe_session_id, total_amount, quantity, inbox_count, domain_count, product_id, price_id, products_bought, types_of_inboxes) VALUES 
('order_test', 'workspace_test', 'client_test', 'ORD-001', 'test123', 10000, 1, 1, 1, 'prod_test', 'price_test', ARRAY['inbox'], ARRAY['GSUITE']::inbox_type[])
ON CONFLICT (stripe_session_id) DO NOTHING;
