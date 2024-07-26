-- 初始化数据库
CREATE OR REPLACE PROCEDURE init_sonoda_database(dbprefix text)
AS $$
DECLARE
  user_table_name text;
  table_table_name text;
  column_table_name text;
  permisson_table_name text;
BEGIN
    user_table_name := dbprefix || '_user';
    table_table_name := dbprefix || '_table';
    column_table_name := dbprefix || '_column';
    permisson_table_name := dbprefix || '_user_table';
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = user_table_name) THEN
        EXECUTE format('CREATE TABLE %I (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            nickname VARCHAR(50),
            password VARCHAR(50) NOT NULL,
            data_active BOOLEAN NOT NULL,
            create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            create_user VARCHAR(50) NOT NULL,
            update_user VARCHAR(50) NOT NULL
        )', user_table_name);
        EXECUTE format('INSERT INTO %I (name, nickname, password, data_active, create_user, update_user)
            VALUES (''system'', ''system'', ''system'', true, ''system'', ''system'')', user_table_name);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = table_table_name) THEN
        EXECUTE format('CREATE TABLE %I (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            title VARCHAR(50) NOT NULL,
            columns INTEGER[] NOT NULL,
            comment VARCHAR(255),
            data_active BOOLEAN,
            create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            create_user VARCHAR(50) NOT NULL,
            update_user VARCHAR(50) NOT NULL
        )', table_table_name);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = column_table_name) THEN
        EXECUTE format('CREATE TABLE %I (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            title VARCHAR(50) NOT NULL,
            type JSONB NOT NULL,
            increase BOOLEAN NOT NULL,
            required BOOLEAN NOT NULL,
            index INTEGER NOT NULL,
            unique_value BOOLEAN NOT NULL DEFAULT false,
            default_value JSONB,
            from_table VARCHAR(50) NOT NULL,
            controller JSONB NOT NULL,
            comment VARCHAR(255),
            data_active BOOLEAN,
            create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            create_user VARCHAR(50) NOT NULL,
            update_user VARCHAR(50) NOT NULL
        )', column_table_name);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = permisson_table_name) THEN
        EXECUTE format('CREATE TABLE %I (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            user_name VARCHAR(50) NOT NULL,
            table_id INTEGER NOT NULL,
            table_name VARCHAR(50) NOT NULL,
            permission INTEGER NOT NULL,
            data_active BOOLEAN,
            create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            create_user VARCHAR(50) NOT NULL,
            update_user VARCHAR(50) NOT NULL
        )', permisson_table_name);
        EXECUTE format('COMMENT ON COLUMN %I.permission IS ''1 read, 2 write''', permisson_table_name);
    END IF;
END;
$$ LANGUAGE plpgsql;