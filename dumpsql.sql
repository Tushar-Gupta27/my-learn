--
-- PostgreSQL database dump
--

-- Dumped from database version 13.13
-- Dumped by pg_dump version 14.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: leader_kycs; Type: TABLE; Schema: public; Owner: cm
--

CREATE TABLE public.leader_kycs (
    id bigint NOT NULL,
    cl_id text,
    kyc_status text,
    kyc_comment text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.leader_kycs OWNER TO cm;

--
-- Name: leader_kycs_id_seq; Type: SEQUENCE; Schema: public; Owner: cm
--

CREATE SEQUENCE public.leader_kycs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.leader_kycs_id_seq OWNER TO cm;

--
-- Name: leader_kycs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cm
--

ALTER SEQUENCE public.leader_kycs_id_seq OWNED BY public.leader_kycs.id;


--
-- Name: leader_kycs id; Type: DEFAULT; Schema: public; Owner: cm
--

ALTER TABLE ONLY public.leader_kycs ALTER COLUMN id SET DEFAULT nextval('public.leader_kycs_id_seq'::regclass);


--
-- Data for Name: leader_kycs; Type: TABLE DATA; Schema: public; Owner: cm
--

COPY public.leader_kycs (id, cl_id, kyc_status, kyc_comment, created_at) FROM stdin;
2	abeee5d8-de4f-428d-b1f0-538f2386e292	REJECTED	\N	2023-10-06 19:10:53.265037+05:30
3	e56dd275-dd3e-4cde-a38b-1bbd781c6432	REJECTED	\N	2024-05-07 16:49:16.839056+05:30
4	9785d01a-0bce-46be-a3e3-ea69719820e5	REJECTED	\N	2024-07-18 16:12:28.342098+05:30
\.


--
-- Name: leader_kycs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cm
--

SELECT pg_catalog.setval('public.leader_kycs_id_seq', 4, true);


--
-- Name: leader_kycs leader_kycs_pkey; Type: CONSTRAINT; Schema: public; Owner: cm
--

ALTER TABLE ONLY public.leader_kycs
    ADD CONSTRAINT leader_kycs_pkey PRIMARY KEY (id);


--
-- Name: leader_kycs leader_kycs_cl_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cm
--

ALTER TABLE ONLY public.leader_kycs
    ADD CONSTRAINT leader_kycs_cl_id_fkey FOREIGN KEY (cl_id) REFERENCES public.team_leaders(id);


--
-- Name: TABLE leader_kycs; Type: ACL; Schema: public; Owner: cm
--

GRANT ALL ON TABLE public.leader_kycs TO rajesh_ponna;
GRANT SELECT ON TABLE public.leader_kycs TO metabase;
GRANT SELECT ON TABLE public.leader_kycs TO PUBLIC;


--
-- PostgreSQL database dump complete
--

