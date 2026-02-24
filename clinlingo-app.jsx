import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ============================================================
// LANGUAGE PACK SYSTEM
// Each pack is a self-contained module with metadata + phrases.
// To add a new language: create a new pack object following
// this schema and add it to LANGUAGE_PACKS.
// ============================================================

const BCS_PACK = {
  id: "bcs",
  name: "Rječnik",
  description: "Bosnian · Croatian · Serbian",
  region: "Balkans",
  flag: "🇧🇦",
  sourceLanguage: { code: "en", label: "English" },
  targetLanguages: [
    { code: "bs", label: "Bosanski", flag: "🇧🇦" },
    { code: "hr", label: "Hrvatski", flag: "🇭🇷" },
    { code: "sr", label: "Srpski", flag: "🇷🇸" },
  ],
  categories: [
    { id: "intake", label: "Intake & History", icon: "📋", desc: "Patient intake, medical history, lifestyle" },
    { id: "pain", label: "Pain & Symptoms", icon: "🎯", desc: "Pain location, quality, patterns" },
    { id: "exam", label: "Examination", icon: "🔍", desc: "Physical exam instructions, testing" },
    { id: "treatment", label: "Treatment", icon: "🤲", desc: "Adjustments, dry needling, soft tissue" },
    { id: "exercises", label: "Exercises", icon: "💪", desc: "Home exercises, form cues, prescription" },
    { id: "scheduling", label: "Scheduling", icon: "📅", desc: "Appointments, billing, follow-up" },
    { id: "anatomy", label: "Anatomy", icon: "🦴", desc: "Body parts, tissues, structures" },
    { id: "diagnosis", label: "Diagnosis", icon: "📊", desc: "Conditions, findings, prognosis" },
  ],
  phrases: [
    // === INTAKE / HISTORY ===
    { en: "What brings you in today?", bs: "Šta vas dovodi danas?", hr: "Što vas dovodi danas?", sr: "Šta vas dovodi danas?", cat: "intake" },
    { en: "When did this start?", bs: "Kada je ovo počelo?", hr: "Kada je ovo počelo?", sr: "Kada je ovo počelo?", cat: "intake" },
    { en: "How long have you had this problem?", bs: "Koliko dugo imate ovaj problem?", hr: "Koliko dugo imate ovaj problem?", sr: "Koliko dugo imate ovaj problem?", cat: "intake" },
    { en: "Have you had this before?", bs: "Da li ste ovo imali ranije?", hr: "Jeste li ovo imali ranije?", sr: "Da li ste ovo imali ranije?", cat: "intake" },
    { en: "Have you seen another doctor for this?", bs: "Da li ste bili kod drugog doktora za ovo?", hr: "Jeste li bili kod drugog liječnika za ovo?", sr: "Da li ste bili kod drugog doktora za ovo?", cat: "intake" },
    { en: "Do you have any allergies?", bs: "Da li imate alergije?", hr: "Imate li alergije?", sr: "Da li imate alergije?", cat: "intake" },
    { en: "Are you taking any medications?", bs: "Da li uzimate neke lijekove?", hr: "Uzimate li neke lijekove?", sr: "Da li uzimate neke lekove?", cat: "intake" },
    { en: "Have you had any surgeries?", bs: "Da li ste imali neke operacije?", hr: "Jeste li imali neke operacije?", sr: "Da li ste imali neke operacije?", cat: "intake" },
    { en: "Do you have any medical conditions?", bs: "Da li imate neka medicinska stanja?", hr: "Imate li neka medicinska stanja?", sr: "Da li imate neka medicinska stanja?", cat: "intake" },
    { en: "Please fill out this form.", bs: "Molim vas popunite ovaj obrazac.", hr: "Molim vas ispunite ovaj obrazac.", sr: "Molim vas popunite ovaj obrazac.", cat: "intake" },
    { en: "Do you exercise regularly?", bs: "Da li redovno vježbate?", hr: "Vježbate li redovno?", sr: "Da li redovno vežbate?", cat: "intake" },
    { en: "What do you do for work?", bs: "Šta radite za posao?", hr: "Što radite za posao?", sr: "Šta radite za posao?", cat: "intake" },
    { en: "How active are you on a daily basis?", bs: "Koliko ste aktivni na dnevnoj bazi?", hr: "Koliko ste aktivni na dnevnoj bazi?", sr: "Koliko ste aktivni na dnevnoj bazi?", cat: "intake" },
    { en: "Do you sit for long periods at work?", bs: "Da li dugo sjedite na poslu?", hr: "Sjedite li dugo na poslu?", sr: "Da li dugo sedite na poslu?", cat: "intake" },
    { en: "Have you ever had an X-ray or MRI?", bs: "Da li ste ikada imali rendgen ili MRI?", hr: "Jeste li ikada imali rendgen ili MRI?", sr: "Da li ste ikada imali rendgen ili MRI?", cat: "intake" },
    { en: "Is this related to a car accident or work injury?",  bs: "Da li je ovo vezano za saobraćajnu nesreću ili povredu na poslu?", hr: "Je li ovo vezano za prometnu nesreću ili ozljedu na poslu?", sr: "Da li je ovo vezano za saobraćajnu nesreću ili povredu na poslu?", cat: "intake" },
    { en: "Are you pregnant or could you be pregnant?", bs: "Da li ste trudni ili biste mogli biti trudni?", hr: "Jeste li trudni ili biste mogli biti trudni?", sr: "Da li ste trudni ili biste mogli biti trudni?", cat: "intake" },
    { en: "Do you smoke?", bs: "Da li pušite?", hr: "Pušite li?", sr: "Da li pušite?", cat: "intake" },
    { en: "How much water do you drink daily?", bs: "Koliko vode pijete dnevno?", hr: "Koliko vode pijete dnevno?", sr: "Koliko vode pijete dnevno?", cat: "intake" },
    { en: "How many hours do you sleep?", bs: "Koliko sati spavate?", hr: "Koliko sati spavate?", sr: "Koliko sati spavate?", cat: "intake" },

    // === PAIN / SYMPTOMS ===
    { en: "Where does it hurt?", bs: "Gdje vas boli?", hr: "Gdje vas boli?", sr: "Gde vas boli?", cat: "pain" },
    { en: "Show me where the pain is.", bs: "Pokažite mi gdje vas boli.", hr: "Pokažite mi gdje vas boli.", sr: "Pokažite mi gde vas boli.", cat: "pain" },
    { en: "Does the pain travel anywhere?", bs: "Da li bol putuje negdje?", hr: "Putuje li bol negdje?", sr: "Da li bol putuje negde?", cat: "pain" },
    { en: "On a scale of 1 to 10, how bad is the pain?", bs: "Na skali od 1 do 10, koliko je jak bol?", hr: "Na ljestvici od 1 do 10, koliko je jak bol?", sr: "Na skali od 1 do 10, koliko je jak bol?", cat: "pain" },
    { en: "Is the pain sharp or dull?", bs: "Da li je bol oštar ili tup?", hr: "Je li bol oštar ili tup?", sr: "Da li je bol oštar ili tup?", cat: "pain" },
    { en: "Is it constant or does it come and go?", bs: "Da li je stalan ili dolazi i odlazi?", hr: "Je li stalan ili dolazi i odlazi?", sr: "Da li je stalan ili dolazi i odlazi?", cat: "pain" },
    { en: "Does it hurt more in the morning or evening?", bs: "Da li boli više ujutro ili uveče?", hr: "Boli li više ujutro ili navečer?", sr: "Da li boli više ujutru ili uveče?", cat: "pain" },
    { en: "What makes it worse?", bs: "Šta pogoršava bol?", hr: "Što pogoršava bol?", sr: "Šta pogoršava bol?", cat: "pain" },
    { en: "What makes it better?", bs: "Šta pomaže?", hr: "Što pomaže?", sr: "Šta pomaže?", cat: "pain" },
    { en: "Do you have any numbness or tingling?", bs: "Da li imate utrnulost ili trnce?", hr: "Imate li utrnulost ili trnce?", sr: "Da li imate utrnulost ili trnce?", cat: "pain" },
    { en: "Do you have any weakness?", bs: "Da li osjećate slabost?", hr: "Osjećate li slabost?", sr: "Da li osećate slabost?", cat: "pain" },
    { en: "Does it hurt when you sit?", bs: "Da li boli kad sjedite?", hr: "Boli li kad sjedite?", sr: "Da li boli kad sedite?", cat: "pain" },
    { en: "Does it hurt when you stand?", bs: "Da li boli kad stojite?", hr: "Boli li kad stojite?", sr: "Da li boli kad stojite?", cat: "pain" },
    { en: "Does it hurt when you walk?", bs: "Da li boli kad hodate?", hr: "Boli li kad hodate?", sr: "Da li boli kad hodate?", cat: "pain" },
    { en: "Does it wake you up at night?", bs: "Da li vas budi noću?", hr: "Budi li vas noću?", sr: "Da li vas budi noću?", cat: "pain" },
    { en: "Is the pain getting better, worse, or staying the same?", bs: "Da li se bol poboljšava, pogoršava ili ostaje isti?", hr: "Poboljšava li se, pogoršava ili ostaje isti?", sr: "Da li se bol poboljšava, pogoršava ili ostaje isti?", cat: "pain" },
    { en: "Do you have headaches?", bs: "Da li imate glavobolje?", hr: "Imate li glavobolje?", sr: "Da li imate glavobolje?", cat: "pain" },
    { en: "Do you feel dizzy?", bs: "Da li vam se vrti u glavi?", hr: "Vrti li vam se u glavi?", sr: "Da li vam se vrti u glavi?", cat: "pain" },
    { en: "Is there any burning sensation?", bs: "Da li osjećate peckanje?", hr: "Osjećate li peckanje?", sr: "Da li osećate peckanje?", cat: "pain" },
    { en: "Does the pain go down your leg?", bs: "Da li bol ide niz nogu?", hr: "Ide li bol niz nogu?", sr: "Da li bol ide niz nogu?", cat: "pain" },
    { en: "Does the pain go down your arm?", bs: "Da li bol ide niz ruku?", hr: "Ide li bol niz ruku?", sr: "Da li bol ide niz ruku?", cat: "pain" },
    { en: "Do you feel stiffness?", bs: "Da li osjećate ukočenost?", hr: "Osjećate li ukočenost?", sr: "Da li osećate ukočenost?", cat: "pain" },
    { en: "Is it painful to turn your head?", bs: "Da li je bolno okrenuti glavu?", hr: "Je li bolno okrenuti glavu?", sr: "Da li je bolno okrenuti glavu?", cat: "pain" },

    // === EXAMINATION ===
    { en: "I'm going to examine you now.", bs: "Sada ću vas pregledati.", hr: "Sada ću vas pregledati.", sr: "Sada ću vas pregledati.", cat: "exam" },
    { en: "Please take off your shirt/jacket.", bs: "Molim vas skinite majicu/jaknu.", hr: "Molim vas skinite majicu/jaknu.", sr: "Molim vas skinite majicu/jaknu.", cat: "exam" },
    { en: "Please lie down on your back.", bs: "Molim vas lezite na leđa.", hr: "Molim vas legnite na leđa.", sr: "Molim vas lezite na leđa.", cat: "exam" },
    { en: "Please lie on your stomach.", bs: "Molim vas lezite na stomak.", hr: "Molim vas legnite na trbuh.", sr: "Molim vas lezite na stomak.", cat: "exam" },
    { en: "Please lie on your side.", bs: "Molim vas lezite na bok.", hr: "Molim vas legnite na bok.", sr: "Molim vas lezite na bok.", cat: "exam" },
    { en: "Turn your head to the left.", bs: "Okrenite glavu na lijevo.", hr: "Okrenite glavu na lijevo.", sr: "Okrenite glavu na levo.", cat: "exam" },
    { en: "Turn your head to the right.", bs: "Okrenite glavu na desno.", hr: "Okrenite glavu na desno.", sr: "Okrenite glavu na desno.", cat: "exam" },
    { en: "Bend forward.", bs: "Sagnite se naprijed.", hr: "Sagnite se naprijed.", sr: "Sagnite se napred.", cat: "exam" },
    { en: "Bend backward.", bs: "Nagnite se nazad.", hr: "Nagnite se nazad.", sr: "Nagnite se nazad.", cat: "exam" },
    { en: "Bend to the left.", bs: "Nagnite se na lijevo.", hr: "Nagnite se na lijevo.", sr: "Nagnite se na levo.", cat: "exam" },
    { en: "Bend to the right.", bs: "Nagnite se na desno.", hr: "Nagnite se na desno.", sr: "Nagnite se na desno.", cat: "exam" },
    { en: "Raise your arm.", bs: "Podignite ruku.", hr: "Podignite ruku.", sr: "Podignite ruku.", cat: "exam" },
    { en: "Raise your leg.", bs: "Podignite nogu.", hr: "Podignite nogu.", sr: "Podignite nogu.", cat: "exam" },
    { en: "Push against my hand.", bs: "Gurajte prema mojoj ruci.", hr: "Gurajte prema mojoj ruci.", sr: "Gurajte prema mojoj ruci.", cat: "exam" },
    { en: "Does this hurt?", bs: "Da li ovo boli?", hr: "Boli li ovo?", sr: "Da li ovo boli?", cat: "exam" },
    { en: "Tell me if you feel any pain.", bs: "Recite mi ako osjetite bol.", hr: "Recite mi ako osjetite bol.", sr: "Recite mi ako osetite bol.", cat: "exam" },
    { en: "Take a deep breath.", bs: "Duboko udahnite.", hr: "Duboko udahnite.", sr: "Duboko udahnite.", cat: "exam" },
    { en: "Relax your muscles.", bs: "Opustite mišiće.", hr: "Opustite mišiće.", sr: "Opustite mišiće.", cat: "exam" },
    { en: "Squeeze my fingers.", bs: "Stisnite moje prste.", hr: "Stisnite moje prste.", sr: "Stisnite moje prste.", cat: "exam" },
    { en: "Can you feel this?", bs: "Da li osjećate ovo?", hr: "Osjećate li ovo?", sr: "Da li osećate ovo?", cat: "exam" },
    { en: "Stand up please.", bs: "Ustanite molim vas.", hr: "Ustanite molim vas.", sr: "Ustanite molim vas.", cat: "exam" },
    { en: "Walk across the room.", bs: "Prošetajte kroz sobu.", hr: "Prošetajte kroz sobu.", sr: "Prošetajte kroz sobu.", cat: "exam" },
    { en: "Squat down as low as you can.", bs: "Čučnite koliko nisko možete.", hr: "Čučnite koliko nisko možete.", sr: "Čučnite koliko nisko možete.", cat: "exam" },
    { en: "Stand on one leg.", bs: "Stanite na jednu nogu.", hr: "Stanite na jednu nogu.", sr: "Stanite na jednu nogu.", cat: "exam" },
    { en: "Close your eyes.", bs: "Zatvorite oči.", hr: "Zatvorite oči.", sr: "Zatvorite oči.", cat: "exam" },
    { en: "Touch your toes.", bs: "Dodirnite prste na nogama.", hr: "Dodirnite prste na nogama.", sr: "Dodirnite prste na nogama.", cat: "exam" },
    { en: "I'm going to test your reflexes.", bs: "Testirat ću vaše reflekse.", hr: "Testirat ću vaše reflekse.", sr: "Testiraću vaše reflekse.", cat: "exam" },

    // === TREATMENT ===
    { en: "I'm going to adjust your spine.", bs: "Namjestiću vam kičmu.", hr: "Namjestit ću vam kralježnicu.", sr: "Namestiću vam kičmu.", cat: "treatment" },
    { en: "You might hear a popping sound. That's normal.", bs: "Možda ćete čuti pucketanje. To je normalno.", hr: "Možda ćete čuti pucketanje. To je normalno.", sr: "Možda ćete čuti pucketanje. To je normalno.", cat: "treatment" },
    { en: "I'm going to adjust your neck.", bs: "Namjestiću vam vrat.", hr: "Namjestit ću vam vrat.", sr: "Namestiću vam vrat.", cat: "treatment" },
    { en: "I'm going to use dry needling.", bs: "Koristiću suhu iglu.", hr: "Koristit ću suhu iglu.", sr: "Koristiću suvu iglu.", cat: "treatment" },
    { en: "You may feel a small pinch.", bs: "Možda ćete osjetiti mali ubod.", hr: "Možda ćete osjetiti mali ubod.", sr: "Možda ćete osetiti mali ubod.", cat: "treatment" },
    { en: "The needle goes into the muscle.", bs: "Igla ide u mišić.", hr: "Igla ide u mišić.", sr: "Igla ide u mišić.", cat: "treatment" },
    { en: "This may cause a muscle twitch.", bs: "Ovo može izazvati trzaj mišića.", hr: "Ovo može izazvati trzaj mišića.", sr: "Ovo može izazvati trzaj mišića.", cat: "treatment" },
    { en: "The twitch means we found the trigger point.", bs: "Trzaj znači da smo našli trigger tačku.", hr: "Trzaj znači da smo našli trigger točku.", sr: "Trzaj znači da smo našli trigger tačku.", cat: "treatment" },
    { en: "I'm going to work on the soft tissue.", bs: "Radiću na mekom tkivu.", hr: "Radit ću na mekom tkivu.", sr: "Radiću na mekom tkivu.", cat: "treatment" },
    { en: "This might be a little uncomfortable.", bs: "Ovo može biti malo neugodno.", hr: "Ovo može biti malo neugodno.", sr: "Ovo može biti malo neugodno.", cat: "treatment" },
    { en: "Let me know if the pressure is too much.", bs: "Javite mi ako je pritisak prejak.", hr: "Javite mi ako je pritisak prejak.", sr: "Javite mi ako je pritisak prejak.", cat: "treatment" },
    { en: "Try to relax.", bs: "Pokušajte se opustiti.", hr: "Pokušajte se opustiti.", sr: "Pokušajte se opustiti.", cat: "treatment" },
    { en: "We're going to do some mobility work.", bs: "Radićemo na pokretljivosti.", hr: "Radit ćemo na pokretljivosti.", sr: "Radićemo na pokretljivosti.", cat: "treatment" },
    { en: "I need you to actively push into the stretch.", bs: "Trebam da aktivno gurate u istezanje.", hr: "Trebam da aktivno gurate u istezanje.", sr: "Trebam da aktivno gurate u istezanje.", cat: "treatment" },
    { en: "Hold this position.", bs: "Držite ovaj položaj.", hr: "Držite ovaj položaj.", sr: "Držite ovaj položaj.", cat: "treatment" },
    { en: "Now slowly release.", bs: "Sada polako pustite.", hr: "Sada polako pustite.", sr: "Sada polako pustite.", cat: "treatment" },
    { en: "Breathe in… and breathe out.", bs: "Udahnite… i izdahnite.", hr: "Udahnite… i izdahnite.", sr: "Udahnite… i izdahnite.", cat: "treatment" },
    { en: "We're almost done.", bs: "Skoro smo gotovi.", hr: "Skoro smo gotovi.", sr: "Skoro smo gotovi.", cat: "treatment" },
    { en: "You may be sore tomorrow. That's normal.", bs: "Možda ćete biti bolni sutra. To je normalno.", hr: "Možda ćete biti bolni sutra. To je normalno.", sr: "Možda ćete biti bolni sutra. To je normalno.", cat: "treatment" },
    { en: "Apply ice for 15 minutes if sore.", bs: "Stavite led na 15 minuta ako boli.", hr: "Stavite led na 15 minuta ako boli.", sr: "Stavite led na 15 minuta ako boli.", cat: "treatment" },
    { en: "Drink extra water today.", bs: "Pijte više vode danas.", hr: "Pijte više vode danas.", sr: "Pijte više vode danas.", cat: "treatment" },
    { en: "Avoid heavy lifting for 24 hours.", bs: "Izbjegavajte teško dizanje 24 sata.", hr: "Izbjegavajte teško dizanje 24 sata.", sr: "Izbegavajte teško dizanje 24 sata.", cat: "treatment" },

    // === EXERCISES ===
    { en: "I'm going to show you some exercises.", bs: "Pokazaću vam neke vježbe.", hr: "Pokazat ću vam neke vježbe.", sr: "Pokazaću vam neke vežbe.", cat: "exercises" },
    { en: "Do this exercise every day.", bs: "Radite ovu vježbu svaki dan.", hr: "Radite ovu vježbu svaki dan.", sr: "Radite ovu vežbu svaki dan.", cat: "exercises" },
    { en: "Do this exercise twice a day.", bs: "Radite ovu vježbu dva puta dnevno.", hr: "Radite ovu vježbu dva puta dnevno.", sr: "Radite ovu vežbu dva puta dnevno.", cat: "exercises" },
    { en: "Do 3 sets of 10 repetitions.", bs: "Uradite 3 serije po 10 ponavljanja.", hr: "Napravite 3 serije po 10 ponavljanja.", sr: "Uradite 3 serije po 10 ponavljanja.", cat: "exercises" },
    { en: "Hold for 30 seconds.", bs: "Držite 30 sekundi.", hr: "Držite 30 sekundi.", sr: "Držite 30 sekundi.", cat: "exercises" },
    { en: "Hold for 5 seconds, then relax.", bs: "Držite 5 sekundi, pa se opustite.", hr: "Držite 5 sekundi, pa se opustite.", sr: "Držite 5 sekundi, pa se opustite.", cat: "exercises" },
    { en: "Breathe normally during the exercise.", bs: "Dišite normalno tokom vježbe.", hr: "Dišite normalno tijekom vježbe.", sr: "Dišite normalno tokom vežbe.", cat: "exercises" },
    { en: "Do not hold your breath.", bs: "Nemojte zadržavati dah.", hr: "Nemojte zadržavati dah.", sr: "Nemojte zadržavati dah.", cat: "exercises" },
    { en: "Stop if you feel sharp pain.", bs: "Stanite ako osjetite oštar bol.", hr: "Stanite ako osjetite oštar bol.", sr: "Stanite ako osetite oštar bol.", cat: "exercises" },
    { en: "A little discomfort is okay, but no sharp pain.", bs: "Malo nelagode je u redu, ali ne oštar bol.", hr: "Malo nelagode je u redu, ali ne oštar bol.", sr: "Malo nelagode je u redu, ali ne oštar bol.", cat: "exercises" },
    { en: "Keep your back straight.", bs: "Držite leđa ravno.", hr: "Držite leđa ravno.", sr: "Držite leđa ravno.", cat: "exercises" },
    { en: "Keep your core tight.", bs: "Držite stomak zategnut.", hr: "Držite trbuh zategnut.", sr: "Držite stomak zategnut.", cat: "exercises" },
    { en: "Move slowly and with control.", bs: "Krećite se polako i kontrolisano.", hr: "Krećite se polako i kontrolirano.", sr: "Krećite se polako i kontrolisano.", cat: "exercises" },
    { en: "You should feel a stretch here.", bs: "Trebali biste osjetiti istezanje ovdje.", hr: "Trebali biste osjetiti istezanje ovdje.", sr: "Trebali biste da osetite istezanje ovde.", cat: "exercises" },
    { en: "Squeeze your shoulder blades together.", bs: "Stisnite lopatice zajedno.", hr: "Stisnite lopatice zajedno.", sr: "Stisnite lopatice zajedno.", cat: "exercises" },
    { en: "Tuck your chin.", bs: "Uvucite bradu.", hr: "Uvucite bradu.", sr: "Uvucite bradu.", cat: "exercises" },
    { en: "Push your hips back.", bs: "Gurnite kukove nazad.", hr: "Gurnite kukove nazad.", sr: "Gurnite kukove nazad.", cat: "exercises" },
    { en: "Engage your glutes.", bs: "Aktivirajte gluteuse.", hr: "Aktivirajte gluteuse.", sr: "Aktivirajte gluteuse.", cat: "exercises" },
    { en: "Keep your knees over your toes.", bs: "Držite koljena iznad prstiju.", hr: "Držite koljena iznad prstiju.", sr: "Držite kolena iznad prstiju.", cat: "exercises" },
    { en: "Do these exercises before bed.", bs: "Radite ove vježbe prije spavanja.", hr: "Radite ove vježbe prije spavanja.", sr: "Radite ove vežbe pre spavanja.", cat: "exercises" },
    { en: "I'll send you a video of the exercises.", bs: "Poslaću vam video vježbi.", hr: "Poslat ću vam video vježbi.", sr: "Poslaću vam video vežbi.", cat: "exercises" },
    { en: "Make a circle with your arm.", bs: "Napravite krug sa rukom.", hr: "Napravite krug s rukom.", sr: "Napravite krug sa rukom.", cat: "exercises" },
    { en: "Rotate your wrist slowly.", bs: "Polako rotirajte ručni zglob.", hr: "Polako rotirajte ručni zglob.", sr: "Polako rotirajte ručni zglob.", cat: "exercises" },

    // === SCHEDULING / ADMIN ===
    { en: "I'd like to see you again in one week.", bs: "Želio bih vas vidjeti ponovo za sedmicu dana.", hr: "Želio bih vas vidjeti ponovo za tjedan dana.", sr: "Želeo bih da vas vidim ponovo za nedelju dana.", cat: "scheduling" },
    { en: "I'd like to see you twice a week.", bs: "Želio bih vas vidjeti dva puta sedmično.", hr: "Želio bih vas vidjeti dva puta tjedno.", sr: "Želeo bih da vas vidim dva puta nedeljno.", cat: "scheduling" },
    { en: "We'll reassess in 4 weeks.", bs: "Ponovo ćemo procijeniti za 4 sedmice.", hr: "Ponovo ćemo procijeniti za 4 tjedna.", sr: "Ponovo ćemo proceniti za 4 nedelje.", cat: "scheduling" },
    { en: "Your next appointment is on…", bs: "Vaš sljedeći termin je…", hr: "Vaš sljedeći termin je…", sr: "Vaš sledeći termin je…", cat: "scheduling" },
    { en: "Do you need to reschedule?", bs: "Da li trebate premjestiti termin?", hr: "Trebate li premjestiti termin?", sr: "Da li trebate da premestite termin?", cat: "scheduling" },
    { en: "Please arrive 10 minutes early.", bs: "Molim vas dođite 10 minuta ranije.", hr: "Molim vas dođite 10 minuta ranije.", sr: "Molim vas dođite 10 minuta ranije.", cat: "scheduling" },
    { en: "We accept insurance.", bs: "Primamo osiguranje.", hr: "Primamo osiguranje.", sr: "Primamo osiguranje.", cat: "scheduling" },
    { en: "You'll need to pay at the front desk.", bs: "Trebate platiti na recepciji.", hr: "Trebate platiti na recepciji.", sr: "Trebate da platite na recepciji.", cat: "scheduling" },
    { en: "We need your insurance card.", bs: "Trebamo vašu karticu osiguranja.", hr: "Trebamo vašu karticu osiguranja.", sr: "Trebamo vašu karticu osiguranja.", cat: "scheduling" },
    { en: "Your copay is…", bs: "Vaše učešće je…", hr: "Vaše sudjelovanje je…", sr: "Vaše učešće je…", cat: "scheduling" },
    { en: "Do you have any questions?", bs: "Da li imate pitanja?", hr: "Imate li pitanja?", sr: "Da li imate pitanja?", cat: "scheduling" },
    { en: "Call us if the pain gets worse.", bs: "Pozovite nas ako se bol pogorša.", hr: "Nazovite nas ako se bol pogorša.", sr: "Pozovite nas ako se bol pogorša.", cat: "scheduling" },
    { en: "We will call you to confirm.", bs: "Zvaćemo vas da potvrdimo.", hr: "Nazvat ćemo vas da potvrdimo.", sr: "Zvaćemo vas da potvrdimo.", cat: "scheduling" },
    { en: "Cancel at least 24 hours in advance.", bs: "Otkažite najmanje 24 sata unaprijed.", hr: "Otkažite najmanje 24 sata unaprijed.", sr: "Otkažite najmanje 24 sata unapred.", cat: "scheduling" },

    // === ANATOMY ===
    { en: "neck", bs: "vrat", hr: "vrat", sr: "vrat", cat: "anatomy" },
    { en: "back", bs: "leđa", hr: "leđa", sr: "leđa", cat: "anatomy" },
    { en: "lower back", bs: "donji dio leđa", hr: "donji dio leđa", sr: "donji deo leđa", cat: "anatomy" },
    { en: "upper back", bs: "gornji dio leđa", hr: "gornji dio leđa", sr: "gornji deo leđa", cat: "anatomy" },
    { en: "spine", bs: "kičma", hr: "kralježnica", sr: "kičma", cat: "anatomy" },
    { en: "shoulder", bs: "rame", hr: "rame", sr: "rame", cat: "anatomy" },
    { en: "shoulder blade", bs: "lopatica", hr: "lopatica", sr: "lopatica", cat: "anatomy" },
    { en: "elbow", bs: "lakat", hr: "lakat", sr: "lakat", cat: "anatomy" },
    { en: "wrist", bs: "ručni zglob", hr: "ručni zglob", sr: "ručni zglob", cat: "anatomy" },
    { en: "hand", bs: "šaka", hr: "šaka", sr: "šaka", cat: "anatomy" },
    { en: "fingers", bs: "prsti", hr: "prsti", sr: "prsti", cat: "anatomy" },
    { en: "thumb", bs: "palac", hr: "palac", sr: "palac", cat: "anatomy" },
    { en: "hip", bs: "kuk", hr: "kuk", sr: "kuk", cat: "anatomy" },
    { en: "knee", bs: "koljeno", hr: "koljeno", sr: "koleno", cat: "anatomy" },
    { en: "ankle", bs: "gležanj", hr: "gležanj", sr: "gležanj", cat: "anatomy" },
    { en: "foot", bs: "stopalo", hr: "stopalo", sr: "stopalo", cat: "anatomy" },
    { en: "muscle", bs: "mišić", hr: "mišić", sr: "mišić", cat: "anatomy" },
    { en: "joint", bs: "zglob", hr: "zglob", sr: "zglob", cat: "anatomy" },
    { en: "nerve", bs: "nerv", hr: "živac", sr: "nerv", cat: "anatomy" },
    { en: "bone", bs: "kost", hr: "kost", sr: "kost", cat: "anatomy" },
    { en: "disc", bs: "disk", hr: "disk", sr: "disk", cat: "anatomy" },
    { en: "tendon", bs: "tetiva", hr: "tetiva", sr: "tetiva", cat: "anatomy" },
    { en: "ligament", bs: "ligament", hr: "ligament", sr: "ligament", cat: "anatomy" },
    { en: "rib", bs: "rebro", hr: "rebro", sr: "rebro", cat: "anatomy" },
    { en: "chest", bs: "grudi", hr: "prsa", sr: "grudi", cat: "anatomy" },
    { en: "head", bs: "glava", hr: "glava", sr: "glava", cat: "anatomy" },
    { en: "jaw", bs: "vilica", hr: "čeljust", sr: "vilica", cat: "anatomy" },
    { en: "pelvis", bs: "karlica", hr: "zdjelica", sr: "karlica", cat: "anatomy" },
    { en: "hamstring", bs: "zadnja loža", hr: "stražnja loža", sr: "zadnja loža", cat: "anatomy" },
    { en: "calf", bs: "list", hr: "list", sr: "list", cat: "anatomy" },
    { en: "shin", bs: "cjevanica", hr: "potkoljenica", sr: "cevanica", cat: "anatomy" },
    { en: "thigh", bs: "butina", hr: "bedro", sr: "butina", cat: "anatomy" },
    { en: "forearm", bs: "podlaktica", hr: "podlaktica", sr: "podlaktica", cat: "anatomy" },
    { en: "collarbone", bs: "ključna kost", hr: "ključna kost", sr: "ključna kost", cat: "anatomy" },

    // === DIAGNOSIS / EXPLANATION ===
    { en: "You have a muscle strain.", bs: "Imate istegnuće mišića.", hr: "Imate istegnuće mišića.", sr: "Imate istegnuće mišića.", cat: "diagnosis" },
    { en: "You have a pinched nerve.", bs: "Imate ukliješten nerv.", hr: "Imate ukliješten živac.", sr: "Imate ukliješten nerv.", cat: "diagnosis" },
    { en: "Your joint is inflamed.", bs: "Vaš zglob je upaljen.", hr: "Vaš zglob je upaljen.", sr: "Vaš zglob je upaljen.", cat: "diagnosis" },
    { en: "You have limited range of motion.", bs: "Imate ograničen opseg pokreta.", hr: "Imate ograničen opseg pokreta.", sr: "Imate ograničen opseg pokreta.", cat: "diagnosis" },
    { en: "Your posture is contributing to the problem.", bs: "Vaše držanje doprinosi problemu.", hr: "Vaše držanje doprinosi problemu.", sr: "Vaše držanje doprinosi problemu.", cat: "diagnosis" },
    { en: "The muscles are very tight.", bs: "Mišići su jako zategnuti.", hr: "Mišići su jako zategnuti.", sr: "Mišići su jako zategnuti.", cat: "diagnosis" },
    { en: "There is swelling in this area.", bs: "Ima otoka u ovom području.", hr: "Ima otekline u ovom području.", sr: "Ima otoka u ovom području.", cat: "diagnosis" },
    { en: "This is not serious, but it needs attention.", bs: "Ovo nije ozbiljno, ali treba pažnju.", hr: "Ovo nije ozbiljno, ali treba pažnju.", sr: "Ovo nije ozbiljno, ali treba pažnju.", cat: "diagnosis" },
    { en: "With treatment, this should improve in a few weeks.", bs: "Sa terapijom, ovo bi se trebalo poboljšati za nekoliko sedmica.", hr: "S terapijom, ovo bi se trebalo poboljšati za nekoliko tjedana.", sr: "Sa terapijom, ovo bi trebalo da se poboljša za nekoliko nedelja.", cat: "diagnosis" },
    { en: "I may need to refer you for imaging.", bs: "Možda ću vas trebati uputiti na snimanje.", hr: "Možda ću vas trebati uputiti na snimanje.", sr: "Možda ću morati da vas uputim na snimanje.", cat: "diagnosis" },
    { en: "I recommend you see a specialist.", bs: "Preporučujem da posjetite specijalistu.", hr: "Preporučujem da posjetite specijalista.", sr: "Preporučujem da posetite specijalistu.", cat: "diagnosis" },
    { en: "You have a herniated disc.", bs: "Imate herniju diska.", hr: "Imate herniju diska.", sr: "Imate herniju diska.", cat: "diagnosis" },
    { en: "You have arthritis in this joint.", bs: "Imate artritis u ovom zglobu.", hr: "Imate artritis u ovom zglobu.", sr: "Imate artritis u ovom zglobu.", cat: "diagnosis" },
    { en: "Your muscles are compensating for a weakness.", bs: "Vaši mišići kompenziraju slabost.", hr: "Vaši mišići kompenziraju slabost.", sr: "Vaši mišići kompenzuju slabost.", cat: "diagnosis" },
    { en: "This is a repetitive strain injury.", bs: "Ovo je povreda od ponavljajućeg napora.", hr: "Ovo je ozljeda od ponavljajućeg napora.", sr: "Ovo je povreda od ponavljajućeg napora.", cat: "diagnosis" },
    { en: "Your alignment needs correction.", bs: "Vaš položaj treba korekciju.", hr: "Vaš položaj treba korekciju.", sr: "Vaš položaj treba korekciju.", cat: "diagnosis" },
    { en: "The good news is this is treatable.", bs: "Dobra vijest je da je ovo izlječivo.", hr: "Dobra vijest je da je ovo izlječivo.", sr: "Dobra vest je da je ovo izlečivo.", cat: "diagnosis" },
    { en: "Recovery will take about 4 to 6 weeks.", bs: "Oporavak će trajati oko 4 do 6 sedmica.", hr: "Oporavak će trajati oko 4 do 6 tjedana.", sr: "Oporavak će trajati oko 4 do 6 nedelja.", cat: "diagnosis" },
  ],
};

// ============================================================
// SAMPLE STARTER PACK — demonstrates how easy it is to add
// a new language. This is a placeholder with just a few phrases.
// ============================================================
const SAMPLE_SPANISH_PACK = {
  id: "spanish",
  name: "Clínica",
  description: "Spanish",
  region: "Latin America / Spain",
  flag: "🇪🇸",
  sourceLanguage: { code: "en", label: "English" },
  targetLanguages: [
    { code: "es", label: "Español", flag: "🇪🇸" },
  ],
  categories: [
    { id: "intake", label: "Intake & History", icon: "📋", desc: "Patient intake, medical history" },
    { id: "pain", label: "Pain & Symptoms", icon: "🎯", desc: "Pain location, quality" },
  ],
  phrases: [
    { en: "What brings you in today?", es: "¿Qué lo trae hoy?", cat: "intake" },
    { en: "Where does it hurt?", es: "¿Dónde le duele?", cat: "pain" },
    { en: "On a scale of 1 to 10, how bad is the pain?", es: "En una escala del 1 al 10, ¿qué tan fuerte es el dolor?", cat: "pain" },
  ],
};

// ============================================================
// ALL AVAILABLE PACKS — add new packs here
// ============================================================
const LANGUAGE_PACKS = [BCS_PACK, SAMPLE_SPANISH_PACK];

// ============================================================
// UI COMPONENTS
// ============================================================

function PhraseCard({ phrase, lang, sourceLang, targetLanguages, expanded, onToggle }) {
  const targetCodes = targetLanguages.map(t => t.code);
  const allSame = targetCodes.length > 1 && targetCodes.every(c => phrase[c] === phrase[targetCodes[0]]);

  return (
    <div
      onClick={onToggle}
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderRadius: 14,
        padding: "16px 20px",
        cursor: "pointer",
        border: "1px solid rgba(180,150,120,0.12)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: expanded ? "0 4px 24px rgba(120,90,60,0.1)" : "0 1px 4px rgba(0,0,0,0.03)",
        transform: expanded ? "scale(1.01)" : "scale(1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 16,
            color: "#2d2520",
            fontWeight: 600,
            lineHeight: 1.45,
            marginBottom: 6,
          }}>
            {phrase[sourceLang]}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: "#8b5e3c",
            fontWeight: 500,
            lineHeight: 1.45,
          }}>
            {phrase[lang]}
          </div>
        </div>
        {!allSame && targetCodes.length > 1 && (
          <div style={{
            fontSize: 10,
            color: "#b08860",
            background: "rgba(180,140,100,0.1)",
            padding: "3px 8px",
            borderRadius: 6,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
            marginTop: 2,
            letterSpacing: "0.3px",
            fontWeight: 500,
          }}>
            varies
          </div>
        )}
      </div>
      {expanded && !allSame && targetCodes.length > 1 && (
        <div style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid rgba(180,150,120,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          {targetLanguages.map(tl => (
            <div key={tl.code} style={{
              display: "flex",
              gap: 10,
              alignItems: "baseline",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
            }}>
              <span style={{
                color: "#b08860",
                fontWeight: 600,
                minWidth: 70,
                fontSize: 10,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>{tl.flag} {tl.label}</span>
              <span style={{
                color: tl.code === lang ? "#3a2510" : "#8b7560",
                fontWeight: tl.code === lang ? 600 : 400,
              }}>{phrase[tl.code]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PackSelector({ packs, activePack, onSelect, onClose }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(30,25,20,0.5)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div style={{
        background: "#f5ede4",
        borderRadius: 20,
        padding: 28,
        maxWidth: 400,
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        animation: "slideUp 0.3s ease",
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: 22,
          fontWeight: 700,
          color: "#2d2520",
          marginBottom: 4,
        }}>Language Packs</div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#8b7560",
          margin: "0 0 20px",
        }}>Choose a clinical language pack</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {packs.map(pack => (
            <button
              key={pack.id}
              onClick={() => { onSelect(pack.id); onClose(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 14,
                border: pack.id === activePack ? "2px solid #8b5e3c" : "1px solid rgba(180,150,120,0.15)",
                background: pack.id === activePack ? "rgba(139,94,60,0.08)" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ fontSize: 28 }}>{pack.flag}</span>
              <div>
                <div style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#2d2520",
                }}>{pack.name}</div>
                <div style={{ fontSize: 12, color: "#8b7560" }}>
                  {pack.description} · {pack.phrases.length} phrases
                </div>
              </div>
              {pack.id === activePack && (
                <div style={{ marginLeft: "auto", color: "#8b5e3c", fontWeight: 700, fontSize: 18 }}>✓</div>
              )}
            </button>
          ))}
        </div>

        <div style={{
          marginTop: 20,
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px dashed rgba(180,150,120,0.25)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 13, color: "#a09080", fontFamily: "'DM Sans', sans-serif" }}>
            More language packs coming soon
          </div>
          <div style={{ fontSize: 11, color: "#c0b0a0", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
            Polish · Arabic · Tagalog · Mandarin
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: "rgba(180,150,120,0.12)",
            color: "#5a4a3a",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >Close</button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function ClinLingo() {
  const [activePackId, setActivePackId] = useState("bcs");
  const [showPackSelector, setShowPackSelector] = useState(false);
  const [lang, setLang] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const searchRef = useRef(null);

  const pack = LANGUAGE_PACKS.find(p => p.id === activePackId) || LANGUAGE_PACKS[0];

  // Set default language when pack changes
  useEffect(() => {
    setLang(pack.targetLanguages[0].code);
    setActiveCat(null);
    setSearch("");
    setExpandedId(null);
  }, [activePackId]);

  const activeLang = lang || pack.targetLanguages[0].code;

  const filtered = useMemo(() => {
    let results = pack.phrases;
    if (activeCat) results = results.filter(p => p.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const allCodes = [pack.sourceLanguage.code, ...pack.targetLanguages.map(t => t.code)];
      results = results.filter(p =>
        allCodes.some(code => p[code] && p[code].toLowerCase().includes(q))
      );
    }
    return results;
  }, [activeCat, search, pack]);

  const activeCatData = pack.categories.find(c => c.id === activeCat);

  useEffect(() => { setExpandedId(null); }, [activeCat, search]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #f5ede4 0%, #ebe0d3 30%, #e8ddd0 60%, #f0e6da 100%)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes stagger1 { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: #b0a090; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* Texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b09070' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {showPackSelector && (
        <PackSelector
          packs={LANGUAGE_PACKS}
          activePack={activePackId}
          onSelect={setActivePackId}
          onClose={() => setShowPackSelector(false)}
        />
      )}

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 520, margin: "0 auto", padding: "0 16px 40px",
      }}>

        {/* Header */}
        <div style={{ paddingTop: 48, paddingBottom: 4, textAlign: "center" }}>
          {/* Brand */}
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 12,
          }}>
            <div style={{ width: 32, height: 2, background: "linear-gradient(90deg, transparent, #b08860)", borderRadius: 2 }} />
            <div style={{
              fontSize: 10, letterSpacing: 4, color: "#b08860", fontWeight: 600, textTransform: "uppercase",
            }}>ClinLingo</div>
            <div style={{ width: 32, height: 2, background: "linear-gradient(90deg, #b08860, transparent)", borderRadius: 2 }} />
          </div>

          {/* Pack Name + Switcher */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
            <h1 style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 32, fontWeight: 700, color: "#2d2520",
              margin: 0, lineHeight: 1.2, letterSpacing: "-0.5px",
            }}>
              {pack.name}
            </h1>
            <button
              onClick={() => setShowPackSelector(true)}
              style={{
                background: "rgba(180,140,100,0.12)",
                border: "none",
                borderRadius: 8,
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                transition: "all 0.2s",
              }}
              title="Switch language pack"
            >
              {pack.flag}
            </button>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, color: "#8b7560", margin: "6px 0 0", fontWeight: 400,
          }}>
            Clinical Communication in {pack.description}
          </p>
        </div>

        {/* Language Toggle */}
        {pack.targetLanguages.length > 1 && (
          <div style={{
            display: "flex", justifyContent: "center", gap: 4,
            background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: 4,
            width: "fit-content", margin: "20px auto 16px",
          }}>
            {pack.targetLanguages.map(tl => (
              <button
                key={tl.code}
                onClick={() => setLang(tl.code)}
                style={{
                  padding: "8px 16px", borderRadius: 9,
                  border: "none", cursor: "pointer", fontSize: 13,
                  fontWeight: activeLang === tl.code ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  background: activeLang === tl.code ? "#fff" : "transparent",
                  color: activeLang === tl.code ? "#2d2520" : "#8b7560",
                  boxShadow: activeLang === tl.code ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>{tl.flag}</span>
                {tl.label}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20, marginTop: pack.targetLanguages.length <= 1 ? 20 : 0 }}>
          <div style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            color: "#b09070", fontSize: 16, pointerEvents: "none",
          }}>⌕</div>
          <input
            ref={searchRef}
            type="text"
            placeholder={`Search in English or ${pack.description}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "14px 44px 14px 40px", borderRadius: 14,
              border: "1px solid rgba(180,150,120,0.2)",
              background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              fontSize: 15, fontFamily: "'DM Sans', sans-serif",
              color: "#2d2520", outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(180,130,80,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(180,150,120,0.2)"}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); searchRef.current?.focus(); }}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "rgba(180,150,120,0.15)", border: "none", borderRadius: "50%",
                width: 24, height: 24, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "#8b7560",
              }}
            >✕</button>
          )}
        </div>

        {/* Category Grid */}
        {!activeCat && !search && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24,
          }}>
            {pack.categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                style={{
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(180,150,120,0.1)",
                  borderRadius: 16, padding: "18px 16px",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  animation: `stagger1 0.4s ease ${i * 0.04}s both`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(120,90,60,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.03)";
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 15, fontWeight: 600, color: "#2d2520", marginBottom: 4,
                }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: "#a09080", lineHeight: 1.3 }}>{cat.desc}</div>
                <div style={{ fontSize: 11, color: "#b08860", marginTop: 8, fontWeight: 500 }}>
                  {pack.phrases.filter(p => p.cat === cat.id).length} phrases
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Active Category Header */}
        {activeCat && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
            animation: "stagger1 0.3s ease both",
          }}>
            <button
              onClick={() => setActiveCat(null)}
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(180,150,120,0.15)",
                borderRadius: 10, padding: "8px 14px", cursor: "pointer",
                fontSize: 13, color: "#8b7560",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >← Back</button>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 18, fontWeight: 600, color: "#2d2520",
            }}>
              {activeCatData?.icon} {activeCatData?.label}
            </div>
          </div>
        )}

        {/* Search Count */}
        {search && (
          <div style={{ fontSize: 13, color: "#a09080", marginBottom: 12 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </div>
        )}

        {/* Phrase List */}
        {(activeCat || search) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#a09080", fontSize: 14 }}>
                No phrases found. Try a different search term.
              </div>
            )}
            {filtered.map((phrase, i) => (
              <PhraseCard
                key={`${phrase.en}-${i}`}
                phrase={phrase}
                lang={activeLang}
                sourceLang={pack.sourceLanguage.code}
                targetLanguages={pack.targetLanguages}
                expanded={expandedId === i}
                onToggle={() => setExpandedId(expandedId === i ? null : i)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!activeCat && !search && (
          <div style={{
            textAlign: "center", padding: "20px 0",
            borderTop: "1px solid rgba(180,150,120,0.1)", marginTop: 8,
          }}>
            <div style={{ fontSize: 13, color: "#a09080" }}>
              {pack.phrases.length} phrases across {pack.categories.length} categories
            </div>
            <div style={{ fontSize: 11, color: "#c0b0a0", marginTop: 6 }}>
              ClinLingo · {pack.name} Pack
            </div>
            <div style={{
              marginTop: 16,
              fontSize: 11,
              color: "#b0a090",
              letterSpacing: "0.3px",
            }}>
              v1.0 · Built for clinical communication
            </div>
          </div>
        )}
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
    </div>
  );
}
