--
-- Name: SchoolClasses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."SchoolClasses" (
    "Class" integer NOT NULL,
    "Sections" text[] DEFAULT '{}'::text[],
    "Schoolpk" integer NOT NULL,
    pk integer NOT NULL
);


ALTER TABLE public."SchoolClasses" OWNER TO neondb_owner;

--
-- Name: SchoolClasses_pk_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."SchoolClasses_pk_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SchoolClasses_pk_seq" OWNER TO neondb_owner;

--
-- Name: SchoolClasses_pk_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."SchoolClasses_pk_seq" OWNED BY public."SchoolClasses".pk;


--
-- Name: SchoolClasses pk; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolClasses" ALTER COLUMN pk SET DEFAULT nextval('public."SchoolClasses_pk_seq"'::regclass);


--
-- Name: SchoolClasses SchoolClasses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolClasses"
    ADD CONSTRAINT "SchoolClasses_pkey" PRIMARY KEY (pk);


--
-- Name: SchoolClasses unique_school_class; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolClasses"
    ADD CONSTRAINT unique_school_class UNIQUE ("Schoolpk", "Class");