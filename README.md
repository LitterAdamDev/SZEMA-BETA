## TO-DO

### 2021.03.18. megbeszlés / igények tanárok részéről:

	- Hírek elrendezése: 
		- Olyan hírek megjelenítése, mint például az oldalon lévő funkcionális változások, újítások.stb.
		- Tantárggyal, számonkérés, tananyag.stb.-vel kapcsolatos hírek szelearningre feltöltve, és majd onnan kellene lekérni API-val. (ráér a legvégén)
		- Hírek legyenek hasonlóan a kérdésbázis felépítés szerint (árnyékolt boxos elrendezés) azonban egy hírre ránagyítva az aktuális kerüljön fókuszba, megnagyítás-többi lekicsinyítése..		



- [x] Login page without registration (bug)
- [x] Redirect to a homepage after authentication.
- [x] Creating more pages example
- [x] Database requests etc.
- [ ] Style, design..
- [ ] If someone delete/save the news then make it responsive so modify the components without loading the whole page.
- [ ] etc?
- [ ] QuestionBaseDashboard - ability to add new questions, search from the questions, modify the questions. Create specific groups and assign them with people.
- [x] Static concept design of questionbase has started... (Tivi)
	- [ ] "Keresés a kérdések között" keresőmezőbe írva folyamatosan filtereződik a témakörök a kérdésekhez lista.
	- [ ] "Keresés a témakörök között" keresőmezőbe írva folyamatosan filtereződik a kérdések listája (Csak témakörökön belül, tehát dupla szűrés!)
	- [ ] Keresés a témakörökön belül régióban egy adott kérdésre kattintva kérdés módosítása, törlése, válasz módosítása stb. opciók, akár egy dialógban? (lehet más jobb)
	- [ ] Kérdésbázis alatt lehetőség új kérdése megadására: 1.témakör kiválasztás, kérdés megadása, válaszok megadása, kérdés felvételének rögzítése=kérdése feltöltése a listába.
	- [x] Két oszlopba rendezés!
	- [ ] Kérdés létrehozásakor a válaszok megadásának száma legyen opcinális, aszerint jelenjenek meg a válaszadás lehetőség fieldek.
	- [ ] Új hozzáadásának lehetősége
	- [ ] "Kérdések a ... témában" egy adott kérdére kattintva, betölti az adatokat a "kérdés létrehozása (ennek kérdés kezelésnek kellene lennie akkor)" régióba, ahol lehetőség van szerkeszteni az adott kérdést, vagy akár törölni egy gombbal. Tehát törlés, hozzáadás gomb.
- [ ] CreateTestDashboard - Compile tests (from questions) and add students (students in groups). 2 type of test: 1. In current firebase collection (necessary) 2. Exam tests - must have a new collection and you can add it to the groups.
- [ ] Rules by Geri.

#### Adamdev-rol:
- [ ]  Authentication nem nezi a user title-t (PRIO I.)
- [ ]  Dashboardokat lehet muvelni, lehetoleg hasonlo kiindulassal, material-ui/core-icons ready to use
- [ ]  Elkell donteni hogy kell-e meg dashboard vagy megoldjuk popup dialoggal.
- [ ]  Logout dialog error (still works, falura jo lesz)
- [ ]  Refresh,routing -> Nem varja meg az authentication-t (felugrik a bejelentkezes,csunya de PRIO 10000)




### For problems:

	- Problem: 	'react-scripts' is not recognized as an internal or external command
	- Solve:		npm cache clean --force OR npm update
	
	- Problem:	Firebase modul not found
	- Solve:		npm install --save firebase




