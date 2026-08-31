-- ============================================================
-- REFLEX TEST / SEED DATA
-- Creates one test user for each system role.
-- ============================================================

INSERT INTO users
    (name, email, phone, password_hash, role)
VALUES
    (
        'Jane Wanjiku',
        'jane.retailer@reflex.test',
        '+254712345678',
       ' $2b$10$bAgV658U4gCr3yAXXE8V6./8KD/2l0I6v4LWNz6ls1hhUoSq16qlS'
,
        'RETAILER'
    ),
    (
        'Brian Otieno',
        'brian.dispatcher@reflex.test',
        '+254723456789',
        '$2b$10$bAgV658U4gCr3yAXXE8V6./8KD/2l0I6v4LWNz6ls1hhUoSq16qlS',
        'DISPATCHER'
    ),
    (
        'Kevin Mwangi',
        'kevin.rider@reflex.test',
        '+254734567890',
        '$2b$10$bAgV658U4gCr3yAXXE8V6./8KD/2l0I6v4LWNz6ls1hhUoSq16qlS',
      'RIDER'
    )
ON CONFLICT (email) DO NOTHING;
