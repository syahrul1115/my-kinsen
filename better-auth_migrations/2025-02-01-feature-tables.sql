CREATE TABLE "public"."dosen" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "nbm" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp NOT NULL,
    "updatedAt" timestamp NOT NULL,
    CONSTRAINT "dosen_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."mahasiswa" (
    "id" text NOT NULL,
    "nim" text NOT NULL,
    "place" text,
    "dateOfBirth" text,
    "address" text,
    "studyProgram" text NOT NULL,
    "semester" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp NOT NULL,
    "updatedAt" timestamp NOT NULL,
    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "mahasiswa_unique" UNIQUE ("nim")
) WITH (oids = false);


CREATE TABLE "public"."matkul" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "studyProgram" text NOT NULL,
    "semester" text NOT NULL,
    "dosenId" text NOT NULL,
    "createdAt" timestamp NOT NULL,
    "updatedAt" timestamp NOT NULL,
    CONSTRAINT "matkul_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE TABLE "public"."quesioner" (
    "id" text NOT NULL,
    "fromName" text NOT NULL,
    "fromNim" text NOT NULL,
    "toName" text NOT NULL,
    "toNbm" text NOT NULL,
    "purposeValue" text NOT NULL,
    "processValue" text NOT NULL,
    "evaluationValue" text NOT NULL,
    "descriptionLiked" text,
    "descriptionSuggestion" text,
    "createdAt" timestamp NOT NULL,
    "updatedAt" timestamp NOT NULL,
    CONSTRAINT "quesioner_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."dosen" ADD CONSTRAINT "dosen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."mahasiswa" ADD CONSTRAINT "mahasiswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."matkul" ADD CONSTRAINT "matkul_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES dosen(id) NOT DEFERRABLE;
