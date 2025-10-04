--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg13+1)
-- Dumped by pg_dump version 17.5

-- Started on 2025-10-04 15:10:40

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16766)
-- Name: averages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.averages (
    id integer NOT NULL,
    score integer NOT NULL,
    item_series_id integer NOT NULL,
    username character varying NOT NULL
);


ALTER TABLE public.averages OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16765)
-- Name: averages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.averages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.averages_id_seq OWNER TO postgres;

--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 225
-- Name: averages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.averages_id_seq OWNED BY public.averages.id;


--
-- TOC entry 224 (class 1259 OID 16733)
-- Name: item_series; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_series (
    id integer NOT NULL,
    name character varying NOT NULL,
    year integer NOT NULL,
    description character varying NOT NULL,
    image_url character varying NOT NULL,
    rating_id integer,
    owner_score_id integer,
    user_id integer,
    avg_rating double precision DEFAULT '0'::double precision NOT NULL,
    rating_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.item_series OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16732)
-- Name: item_series_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_series_id_seq OWNER TO postgres;

--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 223
-- Name: item_series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_series_id_seq OWNED BY public.item_series.id;


--
-- TOC entry 228 (class 1259 OID 16787)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16786)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 227
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 220 (class 1259 OID 16676)
-- Name: owner_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owner_scores (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.owner_scores OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16675)
-- Name: owner_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.owner_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owner_scores_id_seq OWNER TO postgres;

--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 219
-- Name: owner_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.owner_scores_id_seq OWNED BY public.owner_scores.id;


--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rating_id_seq OWNER TO postgres;

--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 217
-- Name: rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_id_seq OWNED BY public.rating.id;


--
-- TOC entry 222 (class 1259 OID 16693)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying,
    role character varying DEFAULT 'USER'::character varying NOT NULL,
    keycloak_id character varying,
    email character varying(255),
    first_name character varying(100),
    last_name character varying(100)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16692)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3306 (class 2604 OID 16769)
-- Name: averages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.averages ALTER COLUMN id SET DEFAULT nextval('public.averages_id_seq'::regclass);


--
-- TOC entry 3303 (class 2604 OID 16736)
-- Name: item_series id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_series ALTER COLUMN id SET DEFAULT nextval('public.item_series_id_seq'::regclass);


--
-- TOC entry 3307 (class 2604 OID 16790)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3300 (class 2604 OID 16679)
-- Name: owner_scores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner_scores ALTER COLUMN id SET DEFAULT nextval('public.owner_scores_id_seq'::regclass);


--
-- TOC entry 3299 (class 2604 OID 16393)
-- Name: rating id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating ALTER COLUMN id SET DEFAULT nextval('public.rating_id_seq'::regclass);


--
-- TOC entry 3301 (class 2604 OID 16696)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3486 (class 0 OID 16766)
-- Dependencies: 226
-- Data for Name: averages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3484 (class 0 OID 16733)
-- Dependencies: 224
-- Data for Name: item_series; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.item_series VALUES (24, 'Attack on Titan', 2013, 'มนุษย์ต้องต่อสู้กับไททันเพื่อเอาชีวิตรอด', 'https://s.isanook.com/ga/0/ud/224/1123793/attack-on-titan-(1).jpg?ip/crop/w670h402/q80/jpg', 2, 2, 31, 4.8, 2);
INSERT INTO public.item_series VALUES (23, 'Naruto Shippuden', 2008, 'เรื่องราวของนินจาหนุ่มที่มุ่งมั่นจะเป็นโฮคาเงะ', 'https://filebroker-cdn.lazada.co.th/kf/Se8ee6629f2f842bdbac8a2dc547255baM.jpg', 1, 1, 15, 4.5, 2);


--
-- TOC entry 3488 (class 0 OID 16787)
-- Dependencies: 228
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.migrations VALUES (1, 1738499999999, 'AddKeycloakColumnsToUsers1738499999999');


--
-- TOC entry 3480 (class 0 OID 16676)
-- Dependencies: 220
-- Data for Name: owner_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.owner_scores VALUES (1, '0/5 คะแนน');
INSERT INTO public.owner_scores VALUES (2, '0.5/5 คะแนน');
INSERT INTO public.owner_scores VALUES (3, '1/5 คะแนน');
INSERT INTO public.owner_scores VALUES (4, '1.5/5 คะแนน');
INSERT INTO public.owner_scores VALUES (5, '2/5 คะแนน');
INSERT INTO public.owner_scores VALUES (6, '2.5/5 คะแนน');
INSERT INTO public.owner_scores VALUES (7, '3/5 คะแนน');
INSERT INTO public.owner_scores VALUES (8, '3.5/5 คะแนน');
INSERT INTO public.owner_scores VALUES (9, '4/5 คะแนน');
INSERT INTO public.owner_scores VALUES (10, '4.5/5 คะแนน');
INSERT INTO public.owner_scores VALUES (11, '5/5 คะแนน');


--
-- TOC entry 3478 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rating VALUES (1, 'ส ส่งเสริม', 'ภาพยนตร์ที่ส่งเสริมการเรียนรู้และควรส่งเสริมให้มีการดู');
INSERT INTO public.rating VALUES (2, 'ท ทั่วไป', 'ภาพยนตร์ที่เหมาะสมกับผู้ดูทั่วไป');
INSERT INTO public.rating VALUES (3, 'น 13+', 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป');
INSERT INTO public.rating VALUES (4, 'น 15+', 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 15 ปีขึ้นไป');
INSERT INTO public.rating VALUES (5, 'น 18+', 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 18 ปีขึ้นไป');
INSERT INTO public.rating VALUES (6, 'ฉ 20+', 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 20 ปีขึ้นไป (ตรวจสอบบัตรประชาชน)');


--
-- TOC entry 3482 (class 0 OID 16693)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'sl001', 'abc1234', 'USER', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (5, 'sl002', '$2b$10$EpM6pef1RZy4/WlcgVP4reeKmjs0xjMKB7EDi/uL8z.SorojCvmRC', 'USER', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (6, 'sl003', '$2b$10$2Pg0a.qom2QfvuOxhleGS.bQpWuGxPGXjprV0fVzQzdJ6WBpb7Fxe', 'USER', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (7, 'sl004', '$2b$10$PSWaJh7zzAGQ7KsharL8Vu26qHtREFTehrXL4S2HruFY0JDwgnA12', 'USER', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (8, 'sl005', '$2b$10$fvyPmS4vbsy9f7WfEK7VxOFQH0M8J9dtv97qskXYO61mgG7R/lGDa', 'USER', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (31, 'kc001', NULL, 'USER', 'b6513db7-2164-4578-af5a-6d7fd3c3c388', 'keycloak@seely.com', 'keycloak1', 'testLogin');
INSERT INTO public.users VALUES (15, 'kc003', NULL, 'USER', 'dd3547e1-2fe6-4c40-a8f7-7d52bd5437e0', 'keycloak3@seely.com', 'keycloak3', 'testLogin');
INSERT INTO public.users VALUES (33, 'kc002', NULL, 'USER', '51041579-8f6d-45db-985c-611ba9fe59d6', 'keycloak2@seely.com', 'keycloak1', 'testLogin');


--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 225
-- Name: averages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.averages_id_seq', 2, true);


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 223
-- Name: item_series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_series_id_seq', 24, true);


--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 227
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, true);


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 219
-- Name: owner_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.owner_scores_id_seq', 11, true);


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 217
-- Name: rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rating_id_seq', 6, true);


--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 33, true);


--
-- TOC entry 3311 (class 2606 OID 16681)
-- Name: owner_scores PK_69e92b31a508339a22f6d9d2ffd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner_scores
    ADD CONSTRAINT "PK_69e92b31a508339a22f6d9d2ffd" PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 16794)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 16700)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 16742)
-- Name: item_series PK_bfe630ed7940e840c7f070e9b56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_series
    ADD CONSTRAINT "PK_bfe630ed7940e840c7f070e9b56" PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 16773)
-- Name: averages PK_dbb171a0d6855bcf83f8f912abb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.averages
    ADD CONSTRAINT "PK_dbb171a0d6855bcf83f8f912abb" PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 16683)
-- Name: rating PK_ecda8ad32645327e4765b43649e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY (id);


--
-- TOC entry 3325 (class 2606 OID 16775)
-- Name: averages UQ_91a43142bc2c4658aebbd9b202f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.averages
    ADD CONSTRAINT "UQ_91a43142bc2c4658aebbd9b202f" UNIQUE (username, item_series_id);


--
-- TOC entry 3315 (class 2606 OID 16705)
-- Name: users UQ_97b5061278a40c1dead71c1b889; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97b5061278a40c1dead71c1b889" UNIQUE (keycloak_id);


--
-- TOC entry 3317 (class 2606 OID 16702)
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- TOC entry 3319 (class 2606 OID 16796)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3330 (class 2606 OID 16776)
-- Name: averages FK_495b2672100874e27c98b470eda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.averages
    ADD CONSTRAINT "FK_495b2672100874e27c98b470eda" FOREIGN KEY (item_series_id) REFERENCES public.item_series(id);


--
-- TOC entry 3328 (class 2606 OID 16748)
-- Name: item_series FK_56ecf578823a082b4467b54eff0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_series
    ADD CONSTRAINT "FK_56ecf578823a082b4467b54eff0" FOREIGN KEY (owner_score_id) REFERENCES public.owner_scores(id);


--
-- TOC entry 3329 (class 2606 OID 16760)
-- Name: item_series FK_768762d51c29c66c943cb823858; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_series
    ADD CONSTRAINT "FK_768762d51c29c66c943cb823858" FOREIGN KEY (rating_id) REFERENCES public.rating(id);


--
-- TOC entry 3331 (class 2606 OID 16781)
-- Name: averages FK_89b5a7f40b2dd66ef091f7eac08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.averages
    ADD CONSTRAINT "FK_89b5a7f40b2dd66ef091f7eac08" FOREIGN KEY (username) REFERENCES public.users(username);


-- Completed on 2025-10-04 15:10:40

--
-- PostgreSQL database dump complete
--

