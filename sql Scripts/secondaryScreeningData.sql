--
-- Name: secondaryScreeningData; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."secondaryScreeningData" (
    "satsId" text NOT NULL,
    "primaryTestResultStatus" text,
    status integer DEFAULT 0,
    "rightEyeSPH" double precision,
    "rightEyeCYL" double precision,
    "rightEyeAXIS" double precision,
    "rightEyeVision" text,
    "leftEyeSPH" double precision,
    "leftEyeCYL" double precision,
    "leftEyeAXIS" double precision,
    "leftEyeVision" text,
    "mobileNumber" text,
    "refractiveError" text,
    "spectaclesFrameCode" text
);


ALTER TABLE public."secondaryScreeningData" OWNER TO neondb_owner;

--
-- Name: secondaryScreeningData secondaryScreeningData_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."secondaryScreeningData"
    ADD CONSTRAINT "secondaryScreeningData_pkey" PRIMARY KEY ("satsId");