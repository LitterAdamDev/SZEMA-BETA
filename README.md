## SZEMA application TO-DO:
- [x] Setting up the basics?
- [x] UI for login/registration page
- [ ] Setting up authentication with firebase and login/reg. page
- [ ] Create other pages, test pages.
- [ ] ....backend, etc.

## Fejlesztésről tudnivalók:
Minden react komponens a "components" mappán belül található.
"components" mappán belül, pedig "login" mappa ami a login oldalért felel. Tehát ebben egyben a regisztráció is benne van így, illetve:

- index.jsx:
	Használt oldalak exportálása, elérési path megadás.
	
- login.jsx:
	- "tellIfAuthWasOk" metódus, amit a "Bejelentkezés Google fiókkal" triggerel. Tehát a gomb lenyomása indítja el, és a metódus csupán egy "alert" function-t hív meg jelenleg.
	- render function: itt van felépítve a bejelentkezés rész, html.
	
	
- register.jsx:
	- Bejelentkezéshez hasonlóan, itt a regisztráció rész felépítése. 

- style.scss:
	- Itt pedig minden ami css..
- App.js:
	- Itt pedig, a regisztráció és a login page közötti váltakozás eddig.

**...other:**
- .jsx kiterjesztések a Visual Studio Code intellisense miatt, így felismeri a react komponesek/sytntax-ot. Ez akár módosítható is .js-re, nem lesz eltérés.
- CSS kiterjesztés helyett SCSS használata(nem mindenhol): 
	SCSS minden olyan feature-t tartalmaz, ami a CSS-ben is benne van, és még több mindent is. (SCSS: advanced CSS),
	így akár változókat is lehet használni benne.
	
## UI for SZEMA login and registration page

### Bejelentkező felület
![Reg oldal](gh_images/reg1.png?raw=true "Reg oldal")

### Regisztrációs felület
![Login oldal](gh_images/log1.png?raw=true "Login oldal")
