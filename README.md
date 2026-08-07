# Course Connect

Kreiraj jednostavnu, modernu i funkcionalnu React web aplikaciju koja predstavlja MVP (Minimum Viable Product) za evidenciju kurseva i polaznika.

Naziv aplikacije

CourseTrack – Evidencija kurseva i polaznika

Cilj aplikacije

Aplikacija treba da omogući korisnicima da se registruju i prijave, pregledaju dostupne kurseve i izaberu kurseve koje žele da pohađaju. Takođe treba da postoji stranica sa pregledom svih registrovanih korisnika, gde se klikom na određenog korisnika mogu videti kursevi koje je taj polaznik izabrao.

Aplikacija treba da bude dovoljno jednostavna za studentski projekat, ali da bude potpuno funkcionalna i da demonstrira rad React frontend aplikacije sa Supabase backend servisom i PostgreSQL bazom podataka.

Tehnologije

Koristi:

React

JavaScript

React Router za navigaciju između stranica

Supabase za backend

Supabase Authentication za registraciju i prijavu korisnika

Supabase PostgreSQL bazu podataka

CSS ili jednostavan UI framework po izboru za moderan i pregledan dizajn

Kod treba da bude organizovan kroz komponente i da bude lak za čitanje i dalje proširivanje.

Glavne funkcionalnosti

1. Registracija korisnika

Napraviti stranicu Register sa formom koja sadrži:

ime i prezime

email adresu

lozinku

potvrdu lozinke

Registraciju realizovati pomoću Supabase Authentication.

Nakon uspešne registracije, osnovne informacije o korisniku sačuvati i u posebnoj tabeli profiles.

Prikazati odgovarajuću poruku ako registracija nije uspešna.

2. Prijava korisnika

Napraviti stranicu Login sa poljima:

email

lozinka

Prijavu realizovati preko Supabase Authentication sistema.

Nakon uspešnog logovanja korisnika preusmeriti na početnu stranicu ili stranicu sa kursevima.

Dodati mogućnost Logout.

3. Početna stranica

Napraviti jednostavan dashboard sa kratkim opisom aplikacije i navigacijom ka:

Kursevima

Korisnicima

Mojim kursevima

Profilu korisnika

Prikazati ime trenutno prijavljenog korisnika.

4. Dostupni kursevi

Napraviti stranicu Courses koja prikazuje sve dostupne kurseve iz Supabase baze.

Za svaki kurs prikazati:

naziv kursa

kratak opis

predavača

trajanje kursa

Primer kurseva:

React osnove

JavaScript za početnike

Web dizajn

SQL i baze podataka

Git i GitHub

Svaki kurs treba da ima dugme:

„Prijavi se na kurs“

Klikom na dugme kreira se veza između trenutno prijavljenog korisnika i izabranog kursa.

Ako je korisnik već prijavljen na kurs, umesto dugmeta za prijavu prikazati informaciju:

„Već ste prijavljeni“

5. Moji kursevi

Napraviti stranicu My Courses na kojoj prijavljeni korisnik može da vidi samo kurseve koje je izabrao.

Za svaki kurs prikazati osnovne podatke.

Omogućiti i opciju:

„Odjavi se sa kursa“

kojom se briše odgovarajuća prijava iz baze.

6. Pregled svih korisnika

Napraviti stranicu Users koja prikazuje sve registrovane korisnike.

Za svakog korisnika prikazati:

ime i prezime

email

Ime korisnika treba da bude klikabilno.

Klikom na ime otvoriti stranicu:

/users/:id

7. Detalji korisnika

Na stranici pojedinačnog korisnika prikazati:

ime i prezime korisnika

email

spisak kurseva koje je korisnik izabrao

Ako korisnik nema izabrane kurseve, prikazati poruku:

„Korisnik trenutno nije prijavljen ni na jedan kurs.“

Predlog baze podataka

Kreirati sledeće tabele u Supabase PostgreSQL bazi.

profiles

Kolone:

id – UUID, primary key, povezan sa auth.users.id

full_name – text

email – text

created_at – timestamp

courses

Kolone:

id – UUID ili bigint, primary key

title – text

description – text

instructor – text

duration – text

created_at – timestamp

enrollments

Tabela predstavlja vezu između korisnika i kurseva.

Kolone:

id – UUID ili bigint, primary key

user_id – foreign key prema profiles.id

course_id – foreign key prema courses.id

created_at – timestamp

Jedan korisnik može biti prijavljen na više kurseva, a jedan kurs može imati više polaznika.

Potrebno je sprečiti duplu prijavu istog korisnika na isti kurs, na primer UNIQUE ograničenjem nad kombinacijom user_id i course_id.

Navigacija

Napraviti zajednički Navbar sa stavkama:

Home

Courses

My Courses

Users

Logout

Ako korisnik nije prijavljen, prikazivati:

Login

Register

Za stranice koje zahtevaju prijavljenog korisnika koristiti protected routes.

Dizajn

Interfejs treba da bude:

jednostavan

moderan

responzivan

pregledan

prilagođen desktop i mobilnim uređajima

Koristi kartice za prikaz kurseva i korisnika.

Forme treba da imaju jasne labele, validaciju i poruke o greškama.

Dodati loading stanje dok se podaci učitavaju iz baze.

Prikazati jasne success/error poruke nakon akcija kao što su registracija, prijava na kurs ili odjava sa kursa.

Supabase integracija

Kreirati poseban fajl za konfiguraciju Supabase klijenta, na primer:

src/lib/supabase.js

Koristiti environment promenljive:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Nemoj hardkodovati Supabase ključeve direktno u kod.

Koristi Supabase za:

registraciju korisnika

login/logout

proveru trenutno prijavljenog korisnika

čitanje podataka

dodavanje podataka

brisanje podataka

povezivanje korisnika sa kursevima

Struktura aplikacije

Organizuj projekat približno ovako:

src/components

Navbar

CourseCard

UserCard

ProtectedRoute

src/pages

Home

Login

Register

Courses

MyCourses

Users

UserDetails

src/lib

supabase.js

Dodaj i potrebne pomoćne fajlove po potrebi.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://course-buddy-16.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ccb154d-f4c8-4f7b-883d-06f532882a24).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
