 

    //  ------------------------------------------------
    //    THÈME CLAIR / SOMBRE
    //    On ajoute/enlève la classe "clair" sur le body
    //    ------------------------------------------------ 

    // Récupérer le bouton et l'icône
    const btnTheme   = document.getElementById('btnTheme');
    const iconeTheme = document.getElementById('iconeTheme');

    // Lire le choix sauvegardé dans le navigateur (localStorage)
    if (localStorage.getItem('theme') === 'clair') {
      document.body.classList.add('clair');
      iconeTheme.className = 'fas fa-moon';
    }

    // Quand on clique sur le bouton, on bascule le thème
    btnTheme.addEventListener('click', function () {
      document.body.classList.toggle('clair');

      if (document.body.classList.contains('clair')) {
        iconeTheme.className = 'fas fa-moon';
        localStorage.setItem('theme', 'clair');
      } else {
        iconeTheme.className = 'fas fa-sun';
        localStorage.setItem('theme', 'sombre');
      }
    });


    /* ------------------------------------------------
       MENU MOBILE (hamburger)
       On ouvre/ferme la liste de navigation
       ------------------------------------------------ */

    const burger   = document.getElementById('burger');
    const navLiens = document.getElementById('navLiens');

    burger.addEventListener('click', function () {
      // toggle() ajoute la classe si elle n'existe pas, la retire sinon
      navLiens.classList.toggle('ouvert');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-lien').forEach(function (lien) {
      lien.addEventListener('click', function () {
        navLiens.classList.remove('ouvert');
      });
    });


    /* ------------------------------------------------
       FILTRES PROJETS
       On cache les cartes qui ne correspondent pas
       ------------------------------------------------ */

    const boutonsFiltres = document.querySelectorAll('.filtre');

    boutonsFiltres.forEach(function (bouton) {
      bouton.addEventListener('click', function () {

        // 1. Retirer la classe "actif" de tous les boutons
        boutonsFiltres.forEach(function (b) { b.classList.remove('actif'); });

        // 2. Ajouter "actif" au bouton cliqué
        bouton.classList.add('actif');

        // 3. Lire la valeur du filtre choisi (ex: "web", "mobile", "tous")
        const filtre = bouton.dataset.filtre;

        // 4. Parcourir toutes les cartes et les afficher ou les cacher
        document.querySelectorAll('.carte-projet').forEach(function (carte) {
          const categorie = carte.dataset.categorie; // lire la catégorie de la carte

          if (filtre === 'tous' || categorie === filtre) {
            carte.classList.remove('cachee'); // afficher
          } else {
            carte.classList.add('cachee');    // cacher
          }
        });

      });
    });


    /* ------------------------------------------------
       ANIMATION AU SCROLL
       Les éléments avec la classe "animer" apparaissent
       progressivement quand ils entrent dans la page
       ------------------------------------------------ */

    // IntersectionObserver surveille quand un élément devient visible
    const observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          // L'élément est visible : on lui ajoute la classe "visible"
          entree.target.classList.add('visible');

          // Si c'est un élément avec des barres de compétences, on les anime
          entree.target.querySelectorAll('.barre-rempli').forEach(function (barre) {
            const niveau = barre.dataset.niveau; // ex: "85"
            barre.style.width = niveau + '%';
          });
        }
      });
    }, { threshold: 0.1 }); // déclencher quand 10% de l'élément est visible

    // Appliquer l'observateur à tous les éléments avec la classe "animer"
    document.querySelectorAll('.animer').forEach(function (el) {
      observateur.observe(el);
    });


    /* ------------------------------------------------
       NAVIGATION ACTIVE AU SCROLL
       Le lien de navigation correspondant à la section
       visible reçoit la classe "actif"
       ------------------------------------------------ */

    window.addEventListener('scroll', function () {
      const sections = document.querySelectorAll('section');
      const liens    = document.querySelectorAll('.nav-lien');

      let sectionVisible = '';

      sections.forEach(function (section) {
        // Si le haut de la section est au-dessus du milieu de l'écran
        if (window.scrollY >= section.offsetTop - 200) {
          sectionVisible = section.id;
        }
      });

      // Mettre à jour les liens
      liens.forEach(function (lien) {
        lien.classList.remove('actif');
        if (lien.getAttribute('href') === '#' + sectionVisible) {
          lien.classList.add('actif');
        }
      });
    });


    /* ------------------------------------------------
       FORMULAIRE DE CONTACT
       Validation simple avant envoi
       ------------------------------------------------ */

    const formulaire = document.getElementById('formulaireContact');

    formulaire.addEventListener('submit', function (evenement) {
      evenement.preventDefault(); // empêcher le rechargement de la page

      let formulaireValide = true;

      // Vérifier chaque champ obligatoire
      formulaire.querySelectorAll('input, textarea').forEach(function (champ) {
        const groupe   = champ.parentElement; // le div.champ parent
        const erreur   = groupe.querySelector('.msg-erreur');

        groupe.classList.remove('erreur');
        erreur.textContent = '';

        // Champ vide ?
        if (champ.value.trim() === '') {
          groupe.classList.add('erreur');
          erreur.textContent = 'Ce champ est obligatoire.';
          formulaireValide = false;
        }
        // Email mal formé ?
        else if (champ.type === 'email' && !champ.value.includes('@')) {
          groupe.classList.add('erreur');
          erreur.textContent = 'Adresse email invalide.';
          formulaireValide = false;
        }
        // Message trop court ?
        else if (champ.id === 'message' && champ.value.trim().length < 10) {
          groupe.classList.add('erreur');
          erreur.textContent = 'Le message doit faire au moins 10 caractères.';
          formulaireValide = false;
        }
      });

      // Si tout est valide, afficher la modal et réinitialiser le formulaire
      if (formulaireValide) {
        ouvrirModal();
        formulaire.reset();
      }
    });


    /* ------------------------------------------------
       MODAL (fenêtre de confirmation)
       ------------------------------------------------ */

    function ouvrirModal() {
      document.getElementById('modal').classList.add('ouvert');
    }

    function fermerModal() {
      document.getElementById('modal').classList.remove('ouvert');
    }

    // Fermer la modal en cliquant en dehors
    document.getElementById('modal').addEventListener('click', function (e) {
      if (e.target === this) fermerModal();
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fermerModal();
    });


    /* ------------------------------------------------
       TOAST (petite notification en haut à droite)
       ------------------------------------------------ */

    function afficherToast(message) {
      const toast = document.getElementById('toast');
      document.getElementById('toastTexte').textContent = message;

      toast.classList.add('visible');

      // Faire disparaître après 3 secondes
      setTimeout(function () {
        toast.classList.remove('visible');
      }, 3000);
    }



    // ─── Données de contact au format vCard ───────────────────────────────────
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Sokhna Mbengue",
      "N:Mbengue;Sokhna;;;",
      "TEL;TYPE=CELL:+221774356744",
      "URL:https://sokhna.sn",
      "END:VCARD"
    ].join("\n");
    

 
    // ─── Génération du QR code ────────────────────────────────────────────────
    const qr = new QRCode(document.getElementById("qrcode"), {
      text:         vcard,
      width:        200,
      height:       200,
      colorDark:    "#111111",
      colorLight:   "#ffffff",
      correctLevel: QRCode.CorrectLevel.M   // niveau de correction moyen
    });


     function telecharger() {
      const canvas = document.querySelector("#qrcode canvas");
      if (!canvas) {
        alert("QR code pas encore prêt, réessayez dans un instant.");
        return;
      }
      const lien = document.createElement("a");
      lien.download = "qrcode-sokhna-mbengue.png";
      lien.href     = canvas.toDataURL("image/png");
      lien.click();
    }
  


