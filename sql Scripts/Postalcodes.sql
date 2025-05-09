--
-- Name: Postalcodes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Postalcodes" (
    "Country" text,
    "Postalcode" text,
    "Taluk" text,
    "State" text,
    "District" text,
    pk integer NOT NULL
);


ALTER TABLE public."Postalcodes" OWNER TO neondb_owner;

--
-- Name: Postalcodes_pk_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Postalcodes_pk_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Postalcodes_pk_seq" OWNER TO neondb_owner;

--
-- Name: Postalcodes_pk_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Postalcodes_pk_seq" OWNED BY public."Postalcodes".pk;


--
-- Name: Postalcodes pk; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Postalcodes" ALTER COLUMN pk SET DEFAULT nextval('public."Postalcodes_pk_seq"'::regclass);


--
-- Name: Postalcodes Postalcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Postalcodes"
    ADD CONSTRAINT "Postalcodes_pkey" PRIMARY KEY (pk);