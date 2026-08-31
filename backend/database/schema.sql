-- Role Type for application users
CREATE TYPE user_role AS ENUM (
    'RETAILER',
    'DISPATCHER',
    'RIDER'
);

-- Delivery Status Type for tracking order states
CREATE TYPE delivery_status AS ENUM (
    'REQUESTED',
    'ASSIGNED',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
    'CANCELLED'
);
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30),
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE deliveries (
    id BIGSERIAL PRIMARY KEY,

    retailer_id BIGINT NOT NULL
        REFERENCES users(id),

    rider_id BIGINT
        REFERENCES users(id),

    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    delivery_address TEXT NOT NULL,
    item_description TEXT NOT NULL,

    current_status delivery_status
        NOT NULL
        DEFAULT 'REQUESTED',

    qr_token_hash TEXT UNIQUE,


    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,

    delivery_id BIGINT NOT NULL
        REFERENCES deliveries(id),

    dispatcher_id BIGINT NOT NULL
        REFERENCES users(id),

    rider_id BIGINT NOT NULL
        REFERENCES users(id),

    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unassigned_at TIMESTAMPTZ
);
CREATE TABLE status_updates (
    id BIGSERIAL PRIMARY KEY,

    delivery_id BIGINT NOT NULL
        REFERENCES deliveries(id),

    updated_by BIGINT NOT NULL
        REFERENCES users(id),

    status delivery_status NOT NULL,

    note TEXT,

    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE confirmations (
    id BIGSERIAL PRIMARY KEY,

    delivery_id BIGINT NOT NULL UNIQUE
        REFERENCES deliveries(id),

    confirmed_by BIGINT NOT NULL
        REFERENCES users(id),

    confirmation_type VARCHAR(30) NOT NULL,

    proof_url TEXT,

    confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
