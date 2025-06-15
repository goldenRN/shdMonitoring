create table district(
	distid serial primary key,
	distname varchar(50) not null,
	disname varchar(10) not null
);

create table khoroo(
	khid serial primary key,
	khname varchar(50) not null,
	distid  integer, FOREIGN KEY (distid) REFERENCES district(distid) 
);

CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table news(
	newsid serial primary key,
	title TEXT,
	ordernum VARCHAR,
	contractor VARCHAR,
	contractcost INTEGER,
	engeneer VARCHAR,
	startdate TIMESTAMP,
	enddate TIMESTAMP,
	impphase VARCHAR,
	imppercent INTEGER,
	sources VARCHAR,
	totalcost INTEGER,
	news TEXT,
	createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	updatedat TIMESTAMP
);

create table image(
	imageid serial primary key,
	imagepath TEXT not null,
	newsid integer, FOREIGN KEY (newsid) REFERENCES news(newsid)
);

CREATE TRIGGER set_updatedat_news
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_updatedat_column();


CREATE OR REPLACE FUNCTION update_updatedat_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updatedat = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

INSERT INTO district (distname, disname) VALUES
('сонгинохайрхан дүүрэг', 'СХД')