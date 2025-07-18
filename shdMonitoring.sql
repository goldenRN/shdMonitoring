--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-19 17:42:59 +08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 227 (class 1255 OID 16441)
-- Name: update_updatedat_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updatedat_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updatedat = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updatedat_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16444)
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16443)
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO postgres;

--
-- TOC entry 3654 (class 0 OID 0)
-- Dependencies: 225
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: district; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.district (
    distid integer NOT NULL,
    distname character varying(50) NOT NULL,
    disname character varying(10) NOT NULL
);


ALTER TABLE public.district OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: district_distid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.district_distid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.district_distid_seq OWNER TO postgres;

--
-- TOC entry 3655 (class 0 OID 0)
-- Dependencies: 217
-- Name: district_distid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.district_distid_seq OWNED BY public.district.distid;


--
-- TOC entry 224 (class 1259 OID 16428)
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    imageid integer NOT NULL,
    imagepath text NOT NULL,
    newsid integer
);


ALTER TABLE public.image OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16427)
-- Name: image_imageid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.image_imageid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.image_imageid_seq OWNER TO postgres;

--
-- TOC entry 3656 (class 0 OID 0)
-- Dependencies: 223
-- Name: image_imageid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.image_imageid_seq OWNED BY public.image.imageid;


--
-- TOC entry 220 (class 1259 OID 16397)
-- Name: khoroo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.khoroo (
    khid integer NOT NULL,
    khname character varying(50) NOT NULL,
    distid integer
);


ALTER TABLE public.khoroo OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16396)
-- Name: khoroo_khid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.khoroo_khid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.khoroo_khid_seq OWNER TO postgres;

--
-- TOC entry 3657 (class 0 OID 0)
-- Dependencies: 219
-- Name: khoroo_khid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.khoroo_khid_seq OWNED BY public.khoroo.khid;


--
-- TOC entry 222 (class 1259 OID 16418)
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    newsid integer NOT NULL,
    title text,
    ordernum character varying,
    contractor character varying,
    contractcost bigint,
    engeneer character varying,
    startdate timestamp without time zone,
    enddate timestamp without time zone,
    impphase character varying,
    imppercent integer,
    sources character varying,
    totalcost bigint,
    news text,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone,
    khid integer
);


ALTER TABLE public.news OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16417)
-- Name: news_newsid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_newsid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_newsid_seq OWNER TO postgres;

--
-- TOC entry 3658 (class 0 OID 0)
-- Dependencies: 221
-- Name: news_newsid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_newsid_seq OWNED BY public.news.newsid;


--
-- TOC entry 3476 (class 2604 OID 16447)
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- TOC entry 3471 (class 2604 OID 16393)
-- Name: district distid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district ALTER COLUMN distid SET DEFAULT nextval('public.district_distid_seq'::regclass);


--
-- TOC entry 3475 (class 2604 OID 16431)
-- Name: image imageid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image ALTER COLUMN imageid SET DEFAULT nextval('public.image_imageid_seq'::regclass);


--
-- TOC entry 3472 (class 2604 OID 16400)
-- Name: khoroo khid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khoroo ALTER COLUMN khid SET DEFAULT nextval('public.khoroo_khid_seq'::regclass);


--
-- TOC entry 3473 (class 2604 OID 16421)
-- Name: news newsid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN newsid SET DEFAULT nextval('public.news_newsid_seq'::regclass);


--
-- TOC entry 3648 (class 0 OID 16444)
-- Dependencies: 226
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_users (id, username, password, created_at) FROM stdin;
1	admin	$2b$08$dzFEUsLX0At541YbUi9yYuD2HJ9k9ZHKkdRtHsCO0caHcN471zkuC	2025-05-25 13:45:49.935048
\.


--
-- TOC entry 3640 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: district; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.district (distid, distname, disname) FROM stdin;
1	сонгинохайрхан дүүрэг	СХД
\.


--
-- TOC entry 3646 (class 0 OID 16428)
-- Dependencies: 224
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image (imageid, imagepath, newsid) FROM stdin;
\.


--
-- TOC entry 3642 (class 0 OID 16397)
-- Dependencies: 220
-- Data for Name: khoroo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.khoroo (khid, khname, distid) FROM stdin;
4	2-р хороо	1
5	3-р хороо	1
6	1-р хороо	1
3	4-р хороо	1
7	20-р хороо	1
8	10 хороо	1
9	27-р хороо	1
10	27-р хороо	1
11	27-р хороо	1
12	27-р хороо	1
13	27-р хороо	1
14	27-р хороо	1
\.


--
-- TOC entry 3644 (class 0 OID 16418)
-- Dependencies: 222
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (newsid, title, ordernum, contractor, contractcost, engeneer, startdate, enddate, impphase, imppercent, sources, totalcost, news, createdat, updatedat, khid) FROM stdin;
1	Түлхүүр гардуулах гэрээний нөхцөлтэй хороо, өрхийн эмнэлэг, цагдаагын хэсгийн цогцолбор барилга	А/61	Гурванбулаг сод ХХК	2138572438	Ж.Мөнхнаран	2025-05-26 11:14:29	2025-05-26 11:14:29	Гүйцэтгэх үе шат	90	НТХО	500000000	Гэр хорооллыг хөгжүүлэх хөрөнгө оруулалтыг дэмжих хөтөлбөр төсөл нь Улаанбаатар хотын гэр хорооллын бүсэд нийгмийн болон инженерийн дэд бүтцийг цогцоор шийдсэн 6 шинэ дэд төвийн ажлыг 9 жилийн хугацаанд 3 үе шаттайгаар хийж хэрэгжүүлнэ.	2025-05-26 19:18:39.161478	\N	4
2	title	zahramjiin dugaaar	guits	888888	meneger	2025-06-01 00:00:00	2025-06-08 00:00:00	uyshat	70	eh uusver	123123	aguuulga	2025-06-15 19:45:56.076514	\N	6
3	fgdgdhdf	jfksdjkjvnkls	sdvsdvds	45345435	fgdfgdfb	2025-06-01 00:00:00	2025-06-22 00:00:00	uyshat	50	sfsfsdvs	453454524	dfdhdghhnhtth	2025-06-19 01:12:06.234516	\N	8
4	garchig	zahramjiin dugaaar	guitsetgegch	12341234	meneger	2025-12-31 00:00:00	2022-04-14 00:00:00	uyshat	40	eh uusver	123123	aguulga	2025-06-19 14:01:38.957102	\N	7
5	rgvdfgfd	zahramjiin dugaaar	guitsetgegch	888888	fhdfj	2022-04-14 00:00:00	2025-12-31 00:00:00	gush	40	eh uusver	123123	fdfgrff	2025-06-19 14:09:11.95434	\N	6
\.


--
-- TOC entry 3659 (class 0 OID 0)
-- Dependencies: 225
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- TOC entry 3660 (class 0 OID 0)
-- Dependencies: 217
-- Name: district_distid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.district_distid_seq', 2, true);


--
-- TOC entry 3661 (class 0 OID 0)
-- Dependencies: 223
-- Name: image_imageid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.image_imageid_seq', 1, false);


--
-- TOC entry 3662 (class 0 OID 0)
-- Dependencies: 219
-- Name: khoroo_khid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.khoroo_khid_seq', 14, true);


--
-- TOC entry 3663 (class 0 OID 0)
-- Dependencies: 221
-- Name: news_newsid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_newsid_seq', 6, true);


--
-- TOC entry 3487 (class 2606 OID 16452)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3489 (class 2606 OID 16454)
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- TOC entry 3479 (class 2606 OID 16395)
-- Name: district district_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_pkey PRIMARY KEY (distid);


--
-- TOC entry 3485 (class 2606 OID 16435)
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (imageid);


--
-- TOC entry 3481 (class 2606 OID 16402)
-- Name: khoroo khoroo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khoroo
    ADD CONSTRAINT khoroo_pkey PRIMARY KEY (khid);


--
-- TOC entry 3483 (class 2606 OID 16426)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (newsid);


--
-- TOC entry 3493 (class 2620 OID 16442)
-- Name: news set_updatedat_news; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updatedat_news BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updatedat_column();


--
-- TOC entry 3491 (class 2606 OID 16455)
-- Name: news fk_news_khid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT fk_news_khid FOREIGN KEY (khid) REFERENCES public.khoroo(khid) ON DELETE SET NULL;


--
-- TOC entry 3492 (class 2606 OID 16436)
-- Name: image image_newsid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_newsid_fkey FOREIGN KEY (newsid) REFERENCES public.news(newsid);


--
-- TOC entry 3490 (class 2606 OID 16403)
-- Name: khoroo khoroo_distid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khoroo
    ADD CONSTRAINT khoroo_distid_fkey FOREIGN KEY (distid) REFERENCES public.district(distid);


-- Completed on 2025-06-19 17:43:00 +08

--
-- PostgreSQL database dump complete
--

