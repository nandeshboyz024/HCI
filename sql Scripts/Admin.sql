--
-- Name: Admin; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Admin" (
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public."Admin" OWNER TO neondb_owner;

--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (username);