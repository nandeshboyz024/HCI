--
-- Name: Schools; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Schools" (
    "SchoolCode" text NOT NULL,
    "SchoolName" text NOT NULL,
    "HMName" text NOT NULL,
    "HMCN" text DEFAULT '+91 XXX XXX XXXX'::text NOT NULL,
    "Distance" double precision DEFAULT 0 NOT NULL,
    "SchoolEmail" text,
    "Postalcodepk" bigint NOT NULL,
    pk integer NOT NULL
);


ALTER TABLE public."Schools" OWNER TO neondb_owner;

--
-- Name: Schools_pk_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Schools_pk_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Schools_pk_seq" OWNER TO neondb_owner;

--
-- Name: Schools_pk_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Schools_pk_seq" OWNED BY public."Schools".pk;


--
-- Name: Schools pk; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Schools" ALTER COLUMN pk SET DEFAULT nextval('public."Schools_pk_seq"'::regclass);


--
-- Name: Schools Schools_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Schools"
    ADD CONSTRAINT "Schools_pkey" PRIMARY KEY (pk);


--
-- Name: Schools unique_school_code; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Schools"
    ADD CONSTRAINT unique_school_code UNIQUE ("SchoolCode");