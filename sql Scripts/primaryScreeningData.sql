--
-- Name: primaryScreeningData; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."primaryScreeningData" (
    "satsId" text NOT NULL,
    "reVision" text,
    "leVision" text,
    status integer DEFAULT 0,
    "testResultStatus" text
);


ALTER TABLE public."primaryScreeningData" OWNER TO neondb_owner;

--
-- Name: primaryScreeningData primaryScreenerData_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."primaryScreeningData"
    ADD CONSTRAINT "primaryScreenerData_pkey" PRIMARY KEY ("satsId");