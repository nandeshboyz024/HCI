--
-- Name: Students; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Students" (
    "StudentId" text NOT NULL,
    "StudentName" text NOT NULL,
    "ParentName" text NOT NULL,
    "Age" bigint NOT NULL,
    "Sex" text NOT NULL,
    "Class" bigint NOT NULL,
    "Section" text DEFAULT 'All'::text NOT NULL,
    "Schoolpk" integer
);


ALTER TABLE public."Students" OWNER TO neondb_owner;

--
-- Name: Students students_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Students"
    ADD CONSTRAINT students_pkey PRIMARY KEY ("StudentId");