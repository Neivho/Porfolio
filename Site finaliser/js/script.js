let sujetsDataGlobal = [];
let allCategoriesGlobal = [];
let nextSujetId = 0;
let currentLang = 'fr';
let dataHasBeenModified = false;
let explicitlySelectedCategoryKey = null;
let isTranslationCancelled = false;
let translationBackupData = null;
let timeEstimateIntervalId = null;
let translationStartTime = 0;
let totalEstimatedSeconds = 0;
const CONCURRENT_TRANSLATIONS_LIMIT = 5;
let visualTranslationOverrides = {};
let newlyTranslatedSujets = [];
let activeTierFilters = new Set();
let suggestionsWereAdded = false;
let currentSuggestions = {};
let selectedSujetIds = new Set();
let bulkActionsBar, bulkActionsInfo, bulkDeselectAllBtn,
    bulkActionChangeCategoryBtn, bulkActionChangeAgeBtn, bulkActionDeleteBtn,
    bulkEditCategoryModal, bulkEditCategoryModalCloseBtn, bulkEditCategorySelect, bulkEditCategoryConfirmBtn,
    bulkEditAgeModal, bulkEditAgeModalCloseBtn, bulkMinAgeInput, bulkMaxAgeInput, bulkAnyAgeCheckbox, bulkEditAgeConfirmBtn,
    bulkSelectAllBtn;

const OPENROUTER_API_KEYS = [
    "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",
    "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",
    "sk-or-v1-12a31e0ae232f9abebe6f011d1585134f7d2e0966785f795e74240eac76fd18"
];
let currentApiKeyIndex = 0;
const OPENROUTER_REFERRER = window.location.origin || "http://localhost/Dashboard.html";
const OPENROUTER_APP_TITLE = "Lookiz Sujets Dashboard";

let topNavbar, sujetsGrid, categoryFilterSelect, searchSujetInput, searchSujetActionBtn,
    closePopularBtn,
    categoryStatsContainer, languageFilterSelect,
    translationTargetLangSelect, sidebar, sidebarToggleBtn, sidebarCloseBtn,
    sidebarCategoryList, gotoQuickStatsLink, gotoStatsLink, gotoChartsLink,
    gotoPopularLink,
    gotoTopLinkSidebar, backToTopBtn, overlay, contentPusher, downloadAllBtn,
    saveReminder, addSujetBtn, translateAllVisibleBtn, newCategoryNameInput,
    addCategoryBtnGlobal, currentCategoriesListDiv, toastContainer, categorySelectionGrid,
    quickStatsTotalSujetsEl, quickStatsTotalCategoriesEl, themeToggleButton,
    customTranslateDropdownContainer, translateDropdownToggle, translateDropdownCurrentFlag,
    translateDropdownCurrentText, translateDropdownMenuList, customUiLangDropdownContainer,
    languageUiDropdownToggle, languageUiDropdownCurrentFlag, languageUiDropdownCurrentText,
    languageUiDropdownMenuList, translationProgressContainer, translationProgressBar,
    translationProgressTextInfo, translationProgressCancelBtn, translateCategoriesModal,
    translateCategoriesModalCloseBtn, translateCategoriesModalList,
    translateCategoriesSelectAllBtn, translateCategoriesConfirmBtn, saveOptionsModal,
    saveOptionsModalCloseBtn, saveCategorySelectorContainer, saveCategorySelect,
    saveLanguageSelectorContainer, saveLanguageSelect, saveOptionsConfirmBtn,
    customSaveLangDropdownContainer, saveLanguageDropdownToggle,
    saveLanguageDropdownCurrentFlag, saveLanguageDropdownCurrentText, saveLanguageDropdownMenuList,
    langHubModal, openLangHubBtn, langHubModalCloseBtn, hubNavButtons, hubContentPanels,
    versusControls, versusResultsContainer, addCompetitorBtn,
    globalStatsGrid, advancedStatsTableContainer,
    advStatsLangFilter, advStatsSortFilter,
    runAuditBtn, auditReportModal, auditModalCloseBtn, auditReportContent, auditModalTitle,
    advStatsLangToggle, advStatsLangMenuList, tierFiltersContainer,
    openBulkTransferBtn, bulkTransferModal, bulkTransferModalCloseBtn,
    bulkTransferModalTitle, bulkTransferSubjectList,
    bulkTransferSelectAllBtn,
    bulkTransferConfirmBtn, transferTierModal, transferTierModalCloseBtn, transferTierModalTitle;

let translateDropdownTimeout, languageUiDropdownTimeout, saveLanguageDropdownTimeout;
let categoryChartInstance = null, ageChartInstance = null, worldMapChartInstance = null, topLanguagesChartInstance = null, ageDetailChartInstance = null;
let quickStatsSujetsAnimationId = null, quickStatsCategoriesAnimationId = null;

const categoryIcons = {
    "Populaire": "⭐",
    "Animaux":"🐾","Art":"🎨","Aventure":"🧭","Bien-Être":"🧘","Collection":"💎","Cuisine":"🍳","Culture":"🎭","Éducation":"🎓","Émotion":"😊","Espace":"🚀","Fiction":"📖","Géographie":"🗺️","Histoire":"📜","Jeux":"🎲","Langue":"🗣️","Littérature":"📚","Loisir":"🪁","Média":"📰","Métier":"🧑‍🔧","Musique":"🎵","Mythologie":"🔱","Nature":"🌳","Religion":"⛪","Science":"🔬","Sport":"⚽","Technologie":"💻","Transport":"🚗","Animals":"🐾","Art":"🎨","Adventure":"🧭","Well-being":"🧘","Collection":"💎","Cooking":"🍳","Culture":"🎭","Education":"🎓","Emotion":"😊","Space":"🚀","Fiction":"📖","Geography":"🗺️","History":"📜","Games":"🎲","Language":"🗣️","Literature":"📚","Leisure":"🪁","Media":"📰","Profession":"🧑‍🔧","Music":"🎵","Mythology":"🔱","Nature":"🌳","Religion":"⛪","Science":"🔬","Sport":"⚽","Technology":"💻","Transport":"🚗","Tiere":"🐾","Kunst":"🎨","Abenteuer":"🧭","Wohlbefinden":"🧘","Sammlung":"💎","Animales":"🐾","Arte":"🎨","Aventura":"🧭","Bienestar":"🧘","Colección":"💎"
};
const defaultCategoryIcon = "🏷️";
const languageFlags = {fr:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/FR.svg",en:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/GB.svg",de:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/DE.svg",es:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/ES.svg",it:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/IT.svg",pt:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/BR.svg",'pt-PT':"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/PT.svg",ja:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/JP.svg",ko:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/KR.svg",'zh-CN':"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/CN.svg",'zh-TW':"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/TW.svg",nl:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/NL.svg",ru:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/RU.svg",ar:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/SA.svg",hi:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/IN.svg",sv:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/SE.svg",pl:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/PL.svg",tr:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/TR.svg",el:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/GR.svg",cs:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/CZ.svg",hu:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/HU.svg",fi:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/FI.svg",da:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/DK.svg",no:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/NO.svg",uk:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/UA.svg",th:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/TH.svg",vi:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/VN.svg",id:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/ID.svg",ms:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/MY.svg",ro:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/RO.svg",sk:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/SK.svg",bg:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/BG.svg",lt:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/LT.svg",lv:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/LV.svg",et:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/EE.svg",sl:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/SI.svg",hr:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/HR.svg",sr:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/RS.svg",fa:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/IR.svg",sw:"https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG/TZ.svg"};
const langToCountry = {fr:'France',en:'United Kingdom',de:'Germany',es:'Spain',it:'Italy',pt:'Brazil','pt-PT':'Portugal',ja:'Japan',ko:'South Korea','zh-CN':'China','zh-TW':'Taiwan',nl:'Netherlands',ru:'Russia',ar:'Saudi Arabia',hi:'India',sv:'Sweden',pl:'Poland',tr:'Turkey',el:'Greece',cs:'Czechia',hu:'Hungary',fi:'Finland',da:'Denmark',no:'Norway',uk:'Ukraine',th:'Thailand',vi:'Vietnam',id:'Indonesia',ms:'Malaysia',ro:'Romania',sk:'Slovakia',bg:'Bulgaria',lt:'Lithuania',lv:'Latvia',et:'Estonia',sl:'Slovenia',hr:'Croatia',sr:'Serbia',fa:'Iran',sw:'Tanzania'};
const translations = {
    fr: {
        pageTitle: "Dashboard des Sujets de discussion - Lookiz","currentTierLabel": "Tier Actuel",
"destinationTierLabel": "Nouveau Tier",
        navPopularTopics: "Sujets Populaires", sujetsSelected: "sujets sélectionnés","bulkSelectAll": "Tout Sélectionner",
        bulkActionChangeCategory: "Catégorie",
        bulkActionChangeAge: "Âge",
        bulkActionDelete: "Supprimer",
        bulkDeselectAll: "Tout Désélectionner",
        bulkEditCategoryTitle: "Changer la Catégorie",
        bulkEditAgeTitle: "Changer la Tranche d'Âge",
        confirmButton: "Confirmer",
        confirmBulkDelete: "Voulez-vous vraiment supprimer les {count} sujets sélectionnés ?",
        categoryChangedSuccess: "Catégorie changée pour {count} sujets",
        ageChangedSuccess: "Âge changé pour {count} sujets",
        sujetsDeleted: "{count} sujets supprimés",
        recommendationButton: "Recommandations",recommendationsModalTitle: "Sujets Recommandés", 
        recommendationsCount: "{count} sujets recommandés", translationsLabel: "Traductions :",
        noRecommendationsFound: "Bravo ! Tous vos sujets sont d'excellente qualité. Aucun besoin de recommandation pour le moment.",searchButton: "Rechercher", navQuickStats: "Aperçu Rapide", quickStatsTotalSujets: "Sujets ", quickStatsTotalCategories: "Catégories ", errorLoadingDefaultFileNotFound: "Veuillez insérer un fichier JSON pour commencer.", sidebarTitle: "Menu Principal", navStats: "Statistiques Détaillées", navCharts: "Graphiques", sidebarCategoriesTitle: "Catégories", allCategories: "Toutes les catégories", mainHeading: "Découvre les Sujets de discussion !", chooseJsonFile: "Choisir un fichier JSON", filterByCategory: "Filtrer par catégorie :", selectCategoryPromptForFilter: "Aucune catégorie sélectionnée", allCategoriesFilter: "Afficher Tous les Sujets de discussion", filterByLanguage: "Langue :", searchSujetLabel: "Rechercher un sujet :", searchSujetPlaceholder: "Nom du sujet de discussion...", manageCategoriesTitle: "Gérer les Catégories", addCategoryButton: "Ajouter Catégorie", categoryNamePlaceholder: "Nom de la nouvelle catégorie...", categorySelectionTitle: "Explorer par Catégorie", loadingCategories: "Chargement des catégories...", promptSelectCategoryForSujets: "Sélectionnez une catégorie, utilisez le Filtre par Âge ou lancez une recherche pour afficher les sujets de discussion.", statsTitle: "Statistiques Détaillées par Catégorie", calculatingStats: "Calcul des statistiques...", loadingSujets: "Chargement des sujets...", loadingCharts: "Mise à jour des graphiques...", addSujetButton: "Ajouter un Sujet", saveWithOptionsButton: "Sauvegarder (Options)", saveReminderText: "N'oubliez pas de télécharger pour sauvegarder vos modifications !", chartsTitle: "Visualisations Globales", discoveriesByCategoryChartTitle: "Sujets de discussion par Catégorie", distributionByAgeChartTitle: "Distribution par Âge", noSujetMatch: "Aucun sujet de discussion ne correspond aux filtres actuels.", noSujetInLanguage: "Aucun sujet de discussion disponible dans cette langue.", noCategoryToDisplay: "Aucune catégorie à afficher pour la langue sélectionnée.", noCategoryCardsToDisplay: "Aucune catégorie à afficher.", promptChooseFile: "Veuillez choisir un fichier.", errorLoadingStats: "Impossible de calculer les statistiques.", errorLoadingCharts: "Données indisponibles pour le graphique.", unclassifiedCategory: "Non classée", selectCategoryPrompt: "Sélectionner une catégorie...", ageLabel: "Âge", ageFrom: "À partir de", ageTo: "Jusqu'à", ageAny: "Tout âge", yearsSuffix: "ans", sujetSuffix: "sujet", sujetsSuffix: "sujets", totalLabel: "Total", editButton: "Editer", saveButton: "Sauvegarder", cancelButton: "Annuler", deleteButton: "Supprimer", duplicateButton: "Dupliquer", labelName: "Nom :", labelCategory: "Catégorie :", labelMinAge: "Âge minimum :", labelMaxAge: "Âge maximum :", errorSujetNotFoundEdit: "Erreur: Sujet de discussion non trouvé.", errorInvalidAge: "Âge invalide.", errorMinMaxAge: "Âge min > Âge max.", errorNameRequired: "Nom requis.", errorAgeMinTooLow: "L'âge minimum ne peut pas être inférieur à 3 ans.", errorAgeMaxTooHigh: "L'âge maximum ne peut pas être supérieur à 12 ans.", noDataToDownload: "Aucune donnée à télécharger.", errorJsonFileInvalid: "Erreur: Fichier JSON invalide.", jsonNotArrayError: "Format JSON invalide (doit être un objet avec 'sujets' et optionnellement 'categories').", chartDiscoveriesLabel: "Sujets par Catégorie", chartNumberOfDiscoveries: "Nombre de Sujets", statNoAgeData: "Aucune donnée d'âge.", sujetNamesPlaceholder: "Nom du nouveau sujet de discussion", confirmDeleteCategory: "La suppression de catégorie est désactivée.", confirmDeleteSujet: "Supprimer ce sujet de discussion ?", confirmDuplicateSujet: "Dupliquer ce sujet de discussion ?", categoryAlreadyExists: "Catégorie existante.", categoryNameRequired: "Nom de catégorie requis.", categoryAdded: "Catégorie ajoutée !", categoryDeleted: "Catégorie supprimée.", sujetAdded: "Sujet ajouté !", sujetUpdated: "Sujet mis à jour !", sujetDeleted: "Sujet supprimé !", sujetDuplicated: "Sujet dupliqué !", fileLoaded: "Fichier JSON chargé.", confirmPageLeave: "Des modifications n'ont pas été sauvegardées. Quitter quand même ?", translateButton: "Traduire", translateButtonCategory: "Traduire Catégorie", translateCategoriesButton: "Traduire par Catégories", translateToLabel: "Traduire les sujets de discussion en :", customTranslateDropdownDefaultText: "Traduire en...", translationInProgress: "Traduction en cours...", translationSuccess: "Traduction réussie !", translationError: "Erreur de traduction.", translationErrorApiKey: "Erreur API traduction.", confirmTranslateCategory: "Traduire tous les sujets de discussion de cette catégorie ? Ceci peut prendre du temps et utiliser des crédits API.", dataSavedToLocalStorage: "Données sauvegardées localement.", dataRestoredFromLocalStorage: "Données restaurées depuis la sauvegarde locale.", errorSavingToLocalStorage: "Erreur lors de la sauvegarde locale.", errorRestoringFromLocalStorage: "Erreur lors de la restauration locale.", themeToggleLabel: "Changer de thème", translationProgressText: "{completed} / {total} Traduit(s)", translationBatchSummary: "Traduction terminée : {success} {labelSuccess}, {fail} {labelFail}.", labelSuccessSuffix: "réussie(s)", labelFailSuffix: "échec(s)", translateCategoriesModalTitle: "Sélectionner les catégories à traduire", selectAllCategoriesBtn: "Tout Sélectionner", deselectAllCategoriesBtn: "Tout Désélectionner", translateSelectionBtn: "Traduire la Sélection", translationCancelledText: "Annulé !", noSujetsInCategoryToTranslate: "Aucun sujet de discussion dans cette catégorie à traduire vers cette langue.", noSujetsSelectedToTranslate: "Aucun sujet de discussion à traduire dans les catégories sélectionnées.", estimatedTime: "Temps estimé", translationReverted: "Les modifications ont été annulées.",
        saveOptionsModalTitle: "Options de Sauvegarde", saveOptionAll: "Tout sauvegarder", saveOptionByLanguage: "Sauvegarder par langue", saveOptionSpecificCategory: "Sauvegarder une catégorie", selectCategoryToSave: "Choisir une catégorie :", selectLanguageToSave: "Choisir une langue :", noLanguageFound: "Aucune langue disponible.", confirmSaveBtn: "Confirmer la Sauvegarde",
        sujetAlreadyTranslated: "Ce sujet de discussion est déjà traduit dans cette langue.", translationSuccessSingle: "Traduction réussie ! Changez la langue en '{langName}' pour la voir.", translationIdentical: "(Identique)", translationCompleted: "Terminé !", resetViewButton: "Réinitialiser l'affichage", translateViewButton: "Traduire la catégorie", sujetAlreadyExists: "Ce sujet de discussion existe déjà dans cette catégorie.",
        openCategoryButton: "Ouvrir la catégorie",
        closeCategoryButton: "Fermer la catégorie", 
        langHubTitle: "Hub des Langues", hubTabVersus: "Versus", hubTabGlobal: "Global", hubTabAdvanced: "Avancé", langStatsLang1: "Langue", langStatsLang2: "Langue 2", langStatsDefaultMessage: "Sélectionnez au moins deux langues pour lancer la comparaison.", langStatsGlobalTitle: "Vue d'Ensemble Globale", langStatsAdvancedTitle: "Statistiques Avancées", langStatsTotalSubjects: "Sujets Totaux", langStatsWithAge: "Sujets avec Âge", langStatsCategories: "Catégories", sortBy: "Trier par :", sortTotalDesc: "Total (décroissant)", sortTotalAsc: "Total (croissant)", sortNameAsc: "Nom (A-Z)", sortNameDesc: "Nom (Z-A)", sortAgeDesc: "Avec Âge (%)",
        statsAgeSummary: "Sujets avec âge", detailsToggle: "Détails", mostPopularCat: "Catégorie Populaire", avgSubjectsPerCat: "Moy. Sujets/Cat.", uniqueToThisLang: "Catégories Uniques", vsPlaceholder: "vs", addCompetitor: "Ajouter une langue", worldMapGlobalView: "Vue Globale sur Carte", worldMapHover: "{lang}: {count} sujets",
        comparisonTitle: "Détails de la Comparaison", comparisonUniqueTo: "Uniques à {lang}", comparisonCommon: "Sujets Communs", subjectsMissingIn: "Sujets manquants dans {lang}", translateMissingButton: "Traduire les manquants", downloadMissingButton: "Télécharger", allSubjectsMatch: "Tous les sujets de discussion sont synchronisés entre ces deux langues !",
        statCardCompletion: "Complétion", statCardDetails: "Détails par catégorie",
        statSubjectsDifference: "Différence Sujets", subjectsMore: "sujets en plus", subjectsLess: "sujets en moins",
        kpiTotalLangs: "Langues actives", kpiTotalSujets: "Sujets au total", kpiTopLang: "Langue #1", kpiWorstLang: "Langue à améliorer", top5LanguagesTitle: "Top 5 Langues",
        advStatsHeaderCategory: "Catégorie", advStatsHeaderTotal: "Total", advStatsHeaderWithAge: "Avec Âge", advStatsHeaderPercent: "%",
        detailsListWithAge: "Sujets avec Âge", detailsListWithoutAge: "Sujets sans Âge", duplicateWarningTitle: "Doublon !", noAgeWarningTitle: "Sans âge",
        semanticDuplicateWarning: (similarSujet) => `Attention : un sujet de discussion similaire ('${similarSujet}') existe déjà. Voulez-vous continuer ?`, runAuditBtn: "Lancer un Audit", auditModalTitle: "Rapport d'Audit", auditUncategorized: "Sujets non classés", auditIdenticalTranslations: "Traductions identiques à l'original", auditIncoherentAges: "Plages d'âge incohérentes (min > max)", auditNoIssues: "Aucun problème détecté !", auditAllClearMessage: "Votre base de données semble en excellente condition.",
        timeMachineTitle: "Filtrer par Âge", resetTimeMachineBtn: "Réinitialiser",
         timeMachineInactiveText: "Cliquez pour activer le filtre",
        labelAnyAgeCheckbox: "Tout âge",
        placeholderMinAge: "Âge min",
        placeholderMaxAge: "Âge max",
        perfectSync: "Synchronisation Parfaite", multiLangChartTitle: "Comparaison des Statistiques Globales", chartAxisSubjects: "Nombre de Sujets", chartAxisOthers: "Nombre (Catégories / Âge)", statsAgeDistribution: "Répartition par Âge",
        suggestionButton: "Suggestions", suggestionModalTitle: "Suggestions de sujets de discussion", noNewSuggestionsFound: "Toutes nos suggestions sont déjà dans votre base. Bravo !",
        generateMoreSuggestions: "Générer des suggestions", generatingSuggestions: "Génération en cours...", suggestionsForCategory: "Suggestions pour {categoryName}",
        addAll: "Tout Ajouter", add: "Ajouter", reject: "Rejeter",
        categoryNames: { "Populaire": "Populaire", "Science": "Science", "Technologie": "Technologie", "Nature": "Nature", "Histoire": "Histoire", "Animaux": "Animaux", "Art": "Art", "Musique": "Musique", "Litterature": "Littérature", "Sport": "Sport", "Fiction": "Fiction", "Média": "Média", "Geographie": "Géographie", "Jeux": "Jeux", "Langue": "Langue", "Mythologie": "Mythologie", "Religion": "Religion", "Education": "Éducation", "Collection": "Collection", "Transport": "Transport", "Cuisine": "Cuisine", "Bien-Être": "Bien-Être", "Culture": "Culture", "Emotion": "Émotion", "Loisir": "Loisir", "Aventure": "Aventure", "Metier": "Métier", "Espace": "Espace" },
        tierAll: "Tous les tiers",
        tierFree: "Gratuit",
        tierSilver: "Argent",
        tierGold: "Or",
        bulkTransferButton: "Transférer",
        bulkTransferModalTitle: "Transférer des Sujets ",
        selectDestinationTier: "Choisir le nouveau Tier :",
        selectAllBtn: "Tout Sélectionner",
        deselectAllBtn: "Tout Désélectionner",
        transferSelectionBtn: "Transférer la Sélection",
        noSujetsToTransfer: "Aucun sujet à transférer dans cette sélection.",
        selectionTransferred: "La sélection a été transférée avec succès."
    },
    en: {
        pageTitle: "Discussion Topics Dashboard - Lookiz",
        sujetsSelected: "topics selected",
        bulkActionChangeCategory: "Category","bulkSelectAll": "Select All","currentTierLabel": "Current Tier",
"destinationTierLabel": "New Tier",
        bulkActionChangeAge: "Age",
        bulkActionDelete: "Delete",
        bulkDeselectAll: "Deselect All",
        bulkEditCategoryTitle: "Change Category",
        bulkEditAgeTitle: "Change Age Range",
        confirmButton: "Confirm",
        confirmBulkDelete: "Are you sure you want to delete the {count} selected topics?",
        categoryChangedSuccess: "Category changed for {count} topics",
        ageChangedSuccess: "Age changed for {count} topics",
        sujetsDeleted: "{count} topics deleted",
        navPopularTopics: "Popular Topics",
        recommendationButton: "Recommendations",  recommendationsModalTitle: "Recommended Topics",
        recommendationsCount: "{count} recommended topics",  translationsLabel: "Translations:",
        noRecommendationsFound: "Great job! All your topics are of excellent quality. No recommendations needed at this time.",searchButton: "Search", navQuickStats: "Quick Overview", quickStatsTotalSujets: "Total Topics ", quickStatsTotalCategories: "Categories ", errorLoadingDefaultFileNotFound: "Please insert a JSON file to start.", sidebarTitle: "Main Menu", navStats: "Detailed Statistics", navCharts: "Charts", sidebarCategoriesTitle: "Categories", allCategories: "All categories", mainHeading: "Discover Topics!", chooseJsonFile: "Choose JSON file", filterByCategory: "Filter by category:", selectCategoryPromptForFilter: "No category selected", allCategoriesFilter: "Show All Topics", filterByLanguage: "Language:", searchSujetLabel: "Search topic:", searchSujetPlaceholder: "Topic name...", manageCategoriesTitle: "Manage Categories", addCategoryButton: "Add Category", categoryNamePlaceholder: "New category name", categorySelectionTitle: "Explore by Category", loadingCategories: "Loading categories...", promptSelectCategoryForSujets: "Select a category, use the Age Filter or start a search to display topics.", statsTitle: "Detailed Statistics by Category", calculatingStats: "Calculating statistics...", loadingSujets: "Loading topics...", loadingCharts: "Updating charts...", addSujetButton: "Add Topic", saveWithOptionsButton: "Save (Options)", saveReminderText: "Don't forget to download to save your changes!", chartsTitle: "Global Visualizations", discoveriesByCategoryChartTitle: "Topics by Category", distributionByAgeChartTitle: "Distribution by Age", noSujetMatch: "No topic matches the current filters.", noSujetInLanguage: "No topics available in this language.", noCategoryToDisplay: "No categories to display for the selected language.", noCategoryCardsToDisplay: "No categories to display.", promptChooseFile: "Please choose a file.", errorLoadingStats: "Could not calculate statistics.", errorLoadingCharts: "Data unavailable for the chart.", unclassifiedCategory: "Unclassified", selectCategoryPrompt: "Select a category...", ageLabel: "Age", ageFrom: "From", ageTo: "Up to", ageAny: "Any age", yearsSuffix: "years", sujetSuffix: "topic", sujetsSuffix: "topics", totalLabel: "Total", editButton: "Edit", saveButton: "Save", cancelButton: "Cancel", deleteButton: "Delete", duplicateButton: "Duplicate", labelName: "Name:", labelCategory: "Category:", labelMinAge: "Min Age:", labelMaxAge: "Max Age:", errorSujetNotFoundEdit: "Error: Topic not found.", errorInvalidAge: "Invalid age.", errorMinMaxAge: "Min age > Max age.", errorNameRequired: "Name required.", errorAgeMinTooLow: "Minimum age cannot be less than 3 years.", errorAgeMaxTooHigh: "Maximum age cannot be greater than 12 years.", noDataToDownload: "No data to download.", errorJsonFileInvalid: "Error: Invalid JSON file.", jsonNotArrayError: "Invalid JSON format (must be an object with 'sujets' and optionally 'categories').", chartDiscoveriesLabel: "Topics by Category", chartNumberOfDiscoveries: "Number of Topics", statNoAgeData: "No age data.", sujetNamesPlaceholder: "New topic name", confirmDeleteCategory: "Deleting categories is disabled.", confirmDeleteSujet: "Delete this topic?", confirmDuplicateSujet: "Duplicate this topic?", categoryAlreadyExists: "Category exists.", categoryNameRequired: "Category name required.", categoryAdded: "Category added!", categoryDeleted: "Category deleted.", sujetAdded: "Topic added!", sujetUpdated: "Topic updated!", sujetDeleted: "Topic deleted!", sujetDuplicated: "Topic duplicated!", fileLoaded: "JSON file loaded.", confirmPageLeave: "Unsaved changes. Leave anyway?", translateButton: "Translate", translateButtonCategory: "Translate Category", translateCategoriesButton: "Translate by Categories", translateToLabel: "Translate topics to:", customTranslateDropdownDefaultText: "Translate to...", translationInProgress: "Translating...", translationSuccess: "Translated!", translationError: "Translation error.", translationErrorApiKey: "Translation API error.", confirmTranslateCategory: "Translate all topics in this category? This may take time and consume API credits.", dataSavedToLocalStorage: "Data saved locally.", dataRestoredFromLocalStorage: "Data restored from local backup.", errorSavingToLocalStorage: "Error saving data locally.", errorRestoringFromLocalStorage: "Error restoring data locally.", themeToggleLabel: "Toggle theme", translationProgressText: "{completed} / {total} Translated", translationBatchSummary: "Translation finished: {success} successful, {fail} failed.", labelSuccessSuffix: "successful", labelFailSuffix: "failed", translateCategoriesModalTitle: "Select categories to translate", selectAllCategoriesBtn: "Select All", deselectAllCategoriesBtn: "Deselect All", translateSelectionBtn: "Translate Selection", translationCancelledText: "Canceled!", noSujetsInCategoryToTranslate: "No topics in this category to translate to this language.", noSujetsSelectedToTranslate: "No topics to translate in the selected categories.", estimatedTime: "Estimated time", translationReverted: "The changes have been reverted.",
        saveOptionsModalTitle: "Save Options", saveOptionAll: "Save all data", saveOptionByLanguage: "Save by language", saveOptionSpecificCategory: "Save a specific category", selectCategoryToSave: "Choose a category:", selectLanguageToSave: "Choose a language:", noLanguageFound: "No language available.", confirmSaveBtn: "Confirm Save",
         sujetAlreadyTranslated: "This topic is already translated into this language.", translationSuccessSingle: "Translation successful! Switch the UI language to '{langName}' to see it.", translationIdentical: "(Identical)", translationCompleted: "Completed!", resetViewButton: "Reset view", translateViewButton: "Translate category", sujetAlreadyExists: "This topic already exists in this category.",
        openCategoryButton: "Open Category",
        closeCategoryButton: "Close Category",
        langHubTitle: "Language Hub", hubTabVersus: "Versus", hubTabGlobal: "Global", hubTabAdvanced: "Advanced", langStatsLang1: "Language", langStatsLang2: "Language 2", langStatsDefaultMessage: "Select at least two languages to start the comparison.", langStatsGlobalTitle: "Global Overview", langStatsAdvancedTitle: "Advanced Statistics", langStatsTotalSubjects: "Total Topics", langStatsWithAge: "Topics with Age", langStatsCategories: "Categories", sortBy: "Sort by:", sortTotalDesc: "Total (desc)", sortTotalAsc: "Total (asc)", sortNameAsc: "Name (A-Z)", sortNameDesc: "Name (Z-A)", sortAgeDesc: "With Age (%)",
        statsAgeSummary: "Topics with age", detailsToggle: "Details", mostPopularCat: "Top Category", avgSubjectsPerCat: "Avg Topics/Cat.", uniqueToThisLang: "Unique Categories", vsPlaceholder: "vs", addCompetitor: "Add Language", worldMapGlobalView: "Global Map View", worldMapHover: "{lang}: {count} topics",
        comparisonTitle: "Comparison Details", comparisonUniqueTo: "Unique to {lang}", comparisonCommon: "Common Topics", subjectsMissingIn: "Topics missing in {lang}", translateMissingButton: "Translate Missing", downloadMissingButton: "Download", allSubjectsMatch: "All topics are synchronized between these two languages!",
        statCardCompletion: "Completion", statCardDetails: "Details by category",
        statSubjectsDifference: "Topics Difference", subjectsMore: "more topics", subjectsLess: "fewer topics",
        kpiTotalLangs: "Active Languages", kpiTotalSujets: "Total Topics", kpiTopLang: "Top Language", kpiWorstLang: "Lang to Improve", top5LanguagesTitle: "Top 5 Languages",
        advStatsHeaderCategory: "Category", advStatsHeaderTotal: "Total", advStatsHeaderWithAge: "With Age", advStatsHeaderPercent: "%",
        detailsListWithAge: "Topics with Age", detailsListWithoutAge: "Topics without Age", duplicateWarningTitle: "Duplicate!", noAgeWarningTitle: "No Age",
        semanticDuplicateWarning: (similarSujet) => `Warning: A similar topic ('${similarSujet}') already exists. Do you want to continue?`, runAuditBtn: "Run Audit", auditModalTitle: "Audit Report", auditUncategorized: "Uncategorized Topics", auditIdenticalTranslations: "Translations identical to original", auditIncoherentAges: "Incoherent age ranges (min > max)", auditNoIssues: "No issues found!", auditAllClearMessage: "Your database looks to be in excellent condition.",
        timeMachineTitle: "Filter by Age", resetTimeMachineBtn: "Reset",
        timeMachineInactiveText: "Click to activate filter",
        auditAllClearMessage: "Your database looks to be in excellent condition.",
        labelAnyAgeCheckbox: "Any age",
        placeholderMinAge: "Min age",
        placeholderMaxAge: "Max age",
        timeMachineTitle: "Filter by Age",
        perfectSync: "Perfect Sync", multiLangChartTitle: "Overall Statistics Comparison", chartAxisSubjects: "Number of Topics", chartAxisOthers: "Count (Categories / Age)", statsAgeDistribution: "Age Distribution",
        suggestionButton: "Suggestions", suggestionModalTitle: "Topic Suggestions", noNewSuggestionsFound: "All of our suggestions are already in your database. Well done!",
        generateMoreSuggestions: "Generate Suggestions", generatingSuggestions: "Generating...", suggestionsForCategory: "Suggestions for {categoryName}",
        addAll: "Add All", add: "Add", reject: "Reject",
        categoryNames: { "Populaire": "Popular", "Science": "Science", "Technologie": "Technology", "Nature": "Nature", "Histoire": "History", "Animaux": "Animals", "Art": "Art", "Musique": "Music", "Litterature": "Literature", "Sport": "Sport", "Fiction": "Fiction", "Média": "Media", "Geographie": "Geography", "Jeux": "Games", "Langue": "Language", "Mythologie": "Mythology", "Religion": "Religion", "Education": "Education", "Collection": "Collection", "Transport": "Transport", "Cuisine": "Cooking", "Bien-Être": "Well-being", "Culture": "Culture", "Emotion": "Emotion", "Loisir": "Leisure", "Aventure": "Adventure", "Metier": "Profession", "Espace": "Space" },
        tierAll: "All Tiers",
        tierFree: "Free",
        tierSilver: "Silver",
        tierGold: "Gold",
        bulkTransferButton: "Transfer",
        bulkTransferModalTitle: "Transfer Popular Topics",
        selectDestinationTier: "Select new Tier:",
        selectAllBtn: "Select All",
        deselectAllBtn: "Deselect All",
        transferSelectionBtn: "Transfer Selection",
        noSujetsToTransfer: "No topics to transfer in this selection.",
        selectionTransferred: "The selection has been successfully transferred."
    }
};
function initDomElements() {
    topNavbar = document.getElementById('top-navbar');
    sujetsGrid = document.getElementById('sujets-grid');
    closePopularBtn = document.getElementById('close-popular-btn');
    categoryFilterSelect = document.getElementById('category-filter');
    searchSujetInput = document.getElementById('search-sujet-input');
    searchSujetActionBtn = document.getElementById('search-sujet-action-btn');
    minAgeFilterInput = document.getElementById('min-age-filter');
    maxAgeFilterInput = document.getElementById('max-age-filter');
    ageAnyFilterCheckbox = document.getElementById('any-age-filter');
    ageFilterResetBtn = document.getElementById('age-filter-reset-btn');
    categoryStatsContainer = document.getElementById('category-stats-container');
    languageFilterSelect = document.getElementById('language-filter');
    translationTargetLangSelect = document.getElementById('translation-target-lang');
    sidebar = document.getElementById('sidebar');
    sidebarToggleBtn = document.getElementById('sidebar-toggle');
    sidebarCloseBtn = document.getElementById('sidebar-close');
    sidebarCategoryList = document.getElementById('sidebar-category-list');
    gotoQuickStatsLink = document.getElementById('goto-quick-stats-link');
    gotoStatsLink = document.getElementById('goto-stats-link');
    gotoChartsLink = document.getElementById('goto-charts-link');
    gotoPopularLink = document.getElementById('goto-popular-link');
    gotoTopLinkSidebar = document.getElementById('goto-top-link-sidebar');
    backToTopBtn = document.getElementById('back-to-top-btn');
    overlay = document.getElementById('overlay');
    contentPusher = document.getElementById('content-pusher');
    downloadAllBtn = document.getElementById('download-all-btn');
    saveReminder = document.getElementById('save-reminder');
    addSujetBtn = document.getElementById('add-sujet-btn');
    translateAllVisibleBtn = document.getElementById('translate-all-visible-btn');
    newCategoryNameInput = document.getElementById('new-category-name-input');
    addCategoryBtnGlobal = document.getElementById('add-category-btn-global');
    currentCategoriesListDiv = document.getElementById('current-categories-list');
    toastContainer = document.getElementById('toast-container');
    categorySelectionGrid = document.getElementById('category-selection-grid');
    quickStatsTotalSujetsEl = document.getElementById('quick-stats-total-sujets');
    quickStatsTotalCategoriesEl = document.getElementById('quick-stats-total-categories');
    themeToggleButton = document.getElementById('theme-toggle-btn');
    customTranslateDropdownContainer = document.getElementById('custom-translate-dropdown-container');
    translateDropdownToggle = document.getElementById('translate-dropdown-toggle');
    translateDropdownCurrentFlag = document.getElementById('translate-dropdown-current-flag');
    translateDropdownCurrentText = document.getElementById('translate-dropdown-current-text');
    translateDropdownMenuList = document.getElementById('translate-dropdown-menu-list');
    customUiLangDropdownContainer = document.getElementById('custom-ui-lang-dropdown-container');
    languageUiDropdownToggle = document.getElementById('language-ui-dropdown-toggle');
    languageUiDropdownCurrentFlag = document.getElementById('language-ui-dropdown-current-flag');
    languageUiDropdownCurrentText = document.getElementById('language-ui-dropdown-current-text');
    languageUiDropdownMenuList = document.getElementById('language-ui-dropdown-menu-list');
    translationProgressContainer = document.getElementById('translation-progress-container');
    translationProgressBar = document.getElementById('translation-progress-bar');
    translationProgressTextInfo = document.getElementById('translation-progress-text-info');
    translationProgressCancelBtn = document.getElementById('translation-progress-cancel-btn');
    translateCategoriesModal = document.getElementById('translate-categories-modal');
    translateCategoriesModalCloseBtn = document.getElementById('translate-categories-modal-close');
    translateCategoriesModalList = document.getElementById('translate-categories-modal-list');
    translateCategoriesSelectAllBtn = document.getElementById('translate-categories-select-all-btn');
    translateCategoriesConfirmBtn = document.getElementById('translate-categories-confirm-btn');
    saveOptionsModal = document.getElementById('save-options-modal');
    saveOptionsModalCloseBtn = document.getElementById('save-options-modal-close');
    saveCategorySelectorContainer = document.getElementById('save-category-selector-container');
    saveCategorySelect = document.getElementById('save-category-select');
    saveLanguageSelectorContainer = document.getElementById('save-language-selector-container');
    saveLanguageSelect = document.getElementById('save-language-select');
    saveOptionsConfirmBtn = document.getElementById('save-options-confirm-btn');
    customSaveLangDropdownContainer = document.getElementById('custom-save-lang-dropdown-container');
    saveLanguageDropdownToggle = document.getElementById('save-language-dropdown-toggle');
    saveLanguageDropdownCurrentFlag = document.getElementById('save-language-dropdown-current-flag');
    saveLanguageDropdownCurrentText = document.getElementById('save-language-dropdown-current-text');
    saveLanguageDropdownMenuList = document.getElementById('save-language-dropdown-menu-list');
    langHubModal = document.getElementById('lang-hub-modal');
    openLangHubBtn = document.getElementById('open-lang-hub-btn');
    langHubModalCloseBtn = document.getElementById('lang-hub-modal-close');
    hubNavButtons = document.querySelectorAll('.hub-nav-btn');
    hubContentPanels = document.querySelectorAll('.hub-content-panel');
    versusControls = document.getElementById('versus-controls');
    versusResultsContainer = document.getElementById('versus-results-container');
    addCompetitorBtn = document.getElementById('add-competitor-btn');
    globalStatsGrid = document.getElementById('global-stats-kpi-grid');
    advancedStatsTableContainer = document.getElementById('advanced-stats-table-container');
    advStatsLangFilter = document.getElementById('adv-stats-lang-filter');
    advStatsSortFilter = document.getElementById('adv-stats-sort-filter');
    runAuditBtn = document.getElementById('run-audit-btn');
    auditReportModal = document.getElementById('audit-report-modal');
    auditModalCloseBtn = document.getElementById('audit-modal-close');
    auditReportContent = document.getElementById('audit-report-content');
    auditModalTitle = document.getElementById('audit-modal-title');
    advStatsLangToggle = document.getElementById('adv-stats-lang-toggle');
    advStatsLangMenuList = document.getElementById('adv-stats-lang-menu');
    tierFiltersContainer = document.getElementById('tier-filters-container');
    openSuggestionsBtn = document.getElementById('open-suggestions-btn');
    suggestionsModal = document.getElementById('suggestions-modal');
    suggestionsModalCloseBtn = document.getElementById('suggestions-modal-close');
    suggestionsListContainer = document.getElementById('suggestions-list-container');
    suggestionsModalTitle = document.getElementById('suggestions-modal-title');
    ageDetailsChartModal = document.getElementById('age-details-chart-modal');
    ageDetailsModalCloseBtn = document.getElementById('age-details-modal-close');
    ageDetailsModalTitle = document.getElementById('age-details-modal-title');
    ageChartModalContainer = document.getElementById('age-chart-modal-container');
    openRecommendationsBtn = document.getElementById('open-recommendations-btn');
    recommendationsModal = document.getElementById('recommendations-modal');
    recommendationsModalCloseBtn = document.getElementById('recommendations-modal-close');
    recommendationsListContainer = document.getElementById('recommendations-list-container');
    recommendationsModalTitle = document.getElementById('recommendations-modal-title');
    transferTierModal = document.getElementById('transfer-tier-modal');
    transferTierModalCloseBtn = document.getElementById('transfer-tier-modal-close');
    transferTierModalTitle = document.getElementById('transfer-tier-modal-title');
    openBulkTransferBtn = document.getElementById('open-bulk-transfer-modal-btn');
    bulkTransferModal = document.getElementById('bulk-transfer-modal');
    bulkTransferModalCloseBtn = document.getElementById('bulk-transfer-modal-close');
    bulkTransferModalTitle = document.getElementById('bulk-transfer-modal-title');
    bulkTransferSubjectList = document.getElementById('bulk-transfer-subject-list');
    bulkTransferSelectAllBtn = document.getElementById('bulk-transfer-select-all-btn');
    bulkTransferConfirmBtn = document.getElementById('bulk-transfer-confirm-btn');
    bulkActionsBar = document.getElementById('bulk-actions-bar');
    bulkActionsInfo = document.getElementById('bulk-actions-info');
    bulkDeselectAllBtn = document.getElementById('bulk-deselect-all-btn');
    bulkActionChangeCategoryBtn = document.getElementById('bulk-action-change-category');
    bulkActionChangeAgeBtn = document.getElementById('bulk-action-change-age');
    bulkActionDeleteBtn = document.getElementById('bulk-action-delete');
    bulkEditCategoryModal = document.getElementById('bulk-edit-category-modal');
    bulkEditCategoryModalCloseBtn = document.getElementById('bulk-edit-category-modal-close');
    bulkEditCategorySelect = document.getElementById('bulk-edit-category-select');
    bulkEditCategoryConfirmBtn = document.getElementById('bulk-edit-category-confirm-btn');
    bulkEditAgeModal = document.getElementById('bulk-edit-age-modal');
    bulkEditAgeModalCloseBtn = document.getElementById('bulk-edit-age-modal-close');
    bulkMinAgeInput = document.getElementById('bulk-min-age-filter');
    bulkMaxAgeInput = document.getElementById('bulk-max-age-filter');
    bulkAnyAgeCheckbox = document.getElementById('bulk-any-age-filter');
    bulkEditAgeConfirmBtn = document.getElementById('bulk-edit-age-confirm-btn');
    bulkSelectAllBtn = document.getElementById('bulk-select-all-btn');
    bulkDeselectAllBtn = document.getElementById('bulk-deselect-all-btn');
}
function selectAllSujets() {
    const visibleSujetIds = Array.from(sujetsGrid.querySelectorAll('.sujet-card'))
                                  .map(card => card.id.replace('sujet-card-', ''));
    
    visibleSujetIds.forEach(id => selectedSujetIds.add(id));

    document.querySelectorAll('.sujet-card-checkbox input').forEach(cb => {
        if (visibleSujetIds.includes(cb.dataset.sujetId)) {
            cb.checked = true;
            cb.closest('.sujet-card').classList.add('selected');
        }
    });
    
    updateBulkActionsBar();
}
function _getFilteredSujetsByTier(sujetsToFilter) {
    const allButton = tierFiltersContainer.querySelector('[data-tier="all"]');
    if (activeTierFilters.size === 0) {
        if (allButton && !allButton.classList.contains('active')) {
            return [];
        }
        return sujetsToFilter;
    }
    return sujetsToFilter.filter(sujet => {
        const sujetTier = sujet.Tier !== undefined ? String(sujet.Tier) : '0';
        return activeTierFilters.has(sujetTier);
    });
}
function calculateQualityScore(sujet) {
    let score = 0;
    const coreCategories = ["Science", "Histoire", "Art", "Nature", "Technologie", "Aventure", "Sport", "Musique"];
    const allLanguages = [...new Set(sujetsDataGlobal.map(p => p.language || 'fr'))];
    if (sujet.minrecommandedAge !== undefined && sujet.maxrecommandedAge !== undefined) {
        score += 10;
    } else if (sujet.minrecommandedAge !== undefined || sujet.maxrecommandedAge !== undefined) {
        score += 5;
    }
    const sujetKey = sujet.Key;
    const translationsCount = allLanguages.reduce((count, lang) => {
        if (lang === 'fr') return count + 1;
        if (sujetsDataGlobal.some(p => p.Key === sujetKey && p.language === lang)) {
            return count + 1;
        }
        return count;
    }, 0);
    if (translationsCount > allLanguages.length / 2) {
        score += 5;
    }
    score += (translationsCount - 1) * 2;
    if (sujet.category && coreCategories.includes(sujet.category)) {
        score += 3;
    } else if (!sujet.category || sujet.category === "unclassified") {
        score -= 5;
    }
    const wordCount = (sujet.name || "").split(' ').length;
    if (wordCount >= 3 && wordCount <= 6) {
        score += 1;
    }
    return Math.max(0, score);
}
function getRecommendedSujets(count = 15) {
    const sujetsWithScores = sujetsDataGlobal
        .filter(sujet => 
            (sujet.language || 'fr') === 'fr' && 
            (sujet.minrecommandedAge !== undefined || sujet.maxrecommandedAge !== undefined)
        )
        .map(sujet => ({
            sujet: sujet,
            score: calculateQualityScore(sujet)
        }));
    sujetsWithScores.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.sujet.name.localeCompare(b.sujet.name, currentLang, { sensitivity: 'base' });
    });
    return sujetsWithScores;
}
function openRecommendationsModal() {
    if (!recommendationsModal || !recommendationsListContainer || !recommendationsModalTitle) return;
    recommendationsModalTitle.textContent = translations[currentLang]?.recommendationsModalTitle || "Sujets Recommandés";
    const recommendedSujets = getRecommendedSujets(15);
    const countDisplay = document.getElementById('recommendations-count-display');
    if (countDisplay) {
        let countText = translations[currentLang]?.recommendationsCount || "{count} sujets recommandés";
        countDisplay.textContent = countText.replace('{count}', recommendedSujets.length);
    }
    renderRecommendations(recommendedSujets);
    recommendationsModal.classList.add('open');
    recommendationsModal.style.display = 'flex';
}
function closeRecommendationsModal() {
    if (!recommendationsModal) return;
    recommendationsModal.classList.remove('open');
    setTimeout(() => {
        recommendationsModal.style.display = 'none';
    }, 300);
}
function renderRecommendations(recommendedSujets) {
    const sidebarContainer = document.getElementById('recommendations-nav-sidebar');
    const mainContentContainer = document.getElementById('recommendations-list-container');
    if (!sidebarContainer || !mainContentContainer) return;
    if (recommendedSujets.length === 0) {
        mainContentContainer.innerHTML = `<p class="message">${translations[currentLang]?.noRecommendationsFound || "Aucune recommandation."}</p>`;
        sidebarContainer.innerHTML = '';
        return;
    }
    const groupedSujets = recommendedSujets.reduce((acc, item) => {
        const categoryKey = item.sujet.category || 'unclassified';
        if (!acc[categoryKey]) {
            acc[categoryKey] = [];
        }
        acc[categoryKey].push(item);
        return acc;
    }, {});
    const sortedCategoryKeys = Object.keys(groupedSujets).sort((a, b) => {
        return getTranslatedCategoryName(a, currentLang).localeCompare(getTranslatedCategoryName(b, currentLang));
    });
    let sidebarHtml = `
        <ul class="recommendations-sidebar-menu">
            <h5>${translations[currentLang]?.filterByCategory || 'Filtrer par catégorie'}</h5>
    `;
    sortedCategoryKeys.forEach(categoryKey => {
        const categoryName = getTranslatedCategoryName(categoryKey, currentLang);
        const count = groupedSujets[categoryKey].length;
        const icon = categoryIcons[categoryKey] || defaultCategoryIcon;
        sidebarHtml += `
            <li>
                <a class="recommendations-sidebar-link" data-scroll-to="category-group-${categoryKey}">
                    <span>
                        <span class="icon" aria-hidden="true">${icon}</span> ${categoryName}
                    </span>
                    <span class="recommendations-sidebar-count">${count}</span>
                </a>
            </li>
        `;
    });
    sidebarHtml += `</ul>`;
    sidebarContainer.innerHTML = sidebarHtml;
    const allLanguages = [...new Set(sujetsDataGlobal.map(p => p.language || 'fr'))];
    let mainContentHtml = '';
    sortedCategoryKeys.forEach(categoryKey => {
        const categoryItems = groupedSujets[categoryKey];
        categoryItems.sort((a, b) => a.sujet.name.localeCompare(b.sujet.name, currentLang));
        const categoryColor = getCategoryColor(categoryKey);
        
        mainContentHtml += `
            <div id="category-group-${categoryKey}" class="suggestion-category-group">
                <div class="suggestion-category-title-wrapper">
                    <h4 class="suggestion-category-title" style="color: ${categoryColor}; border-bottom-color: ${categoryColor};">
                        ${getTranslatedCategoryName(categoryKey, currentLang)}
                    </h4>
                </div>
                <ul class="recommendations-list">
        `;
        categoryItems.forEach(item => {
            const { sujet } = item;
            const ageText = formatAgeRangeForDisplay(sujet.minrecommandedAge, sujet.maxrecommandedAge);
            const langFlagsHtml = allLanguages.map(langCode => {
                const isTranslated = langCode === 'fr' || sujetsDataGlobal.some(p => p.Key === sujet.Key && p.language === langCode);
                const flagUrl = languageFlags[langCode];
                if (isTranslated && flagUrl) {
                    const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langCode)?.textContent || langCode;
                    return `<img src="${flagUrl}" alt="${langName}" title="${langName}" style="width: 20px; height: 15px; margin-right: 4px; border-radius: 2px;">`;
                }
                return '';
            }).join('');
            mainContentHtml += `
                <li class="recommended-sujet-item" style="border-left-color: ${categoryColor};">
                    <div class="recommended-sujet-info">
                        <h4 class="recommended-sujet-name">${sujet.name}</h4>
                        <div class="recommended-sujet-tags">
                            <span class="tag-age">🎯 ${ageText}</span>
                        </div>
                        <div class="recommended-sujet-langs">
                            <span>${translations[currentLang]?.translationsLabel || 'Traductions :'}</span>
                            ${langFlagsHtml}
                        </div>
                    </div>
                </li>
            `;
        });
        mainContentHtml += `</ul></div>`;
    });
    mainContentContainer.innerHTML = mainContentHtml;
    sidebarContainer.querySelectorAll('.recommendations-sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.scrollTo;
            const targetElement = mainContentContainer.querySelector(`#${targetId}`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
function isColorDark(colorStr) {
    if (!colorStr) return false;
    let r, g, b;
    if (colorStr.match(/^rgb/)) {
        const a = colorStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        if (!a) return false;
        [r, g, b] = [parseInt(a[1]), parseInt(a[2]), parseInt(a[3])];
    } else {
        const hex = colorStr.replace(/#/, '');
        const bigint = parseInt(hex, 16);
        r = (bigint >> 16) & 255;
        g = (bigint >> 8) & 255;
        b = bigint & 255;
    }
    const luminance = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return luminance < 128;
}
function generateSujetKey(category, name) {
    const sanitize = (str) => (str || '')
        .trim()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    const catPart = sanitize(category) || 'uncategorized';
    const namePart = sanitize(name);
    return `${catPart}_${namePart}`;
}
function getCanonicalCategoryKey(categoryNameFromFile, langOfFileFromFile) {
    if (!categoryNameFromFile || typeof categoryNameFromFile !== 'string') return "";
    const trimmedCatName = categoryNameFromFile.trim();
    if (langOfFileFromFile === 'fr' || !langOfFileFromFile) return trimmedCatName;
    for (const uiLang of ['en', 'de', 'es']) {
        if (translations[uiLang] && translations[uiLang].categoryNames) {
            for (const canonicalFrenchKey in translations[uiLang].categoryNames) {
                if (translations[uiLang].categoryNames[canonicalFrenchKey] === trimmedCatName && uiLang === langOfFileFromFile) {
                    return canonicalFrenchKey;
                }
            }
        }
    }
    if (!translations.fr.categoryNames.hasOwnProperty(trimmedCatName)) {
        translations.fr.categoryNames[trimmedCatName] = trimmedCatName;
        ['en', 'de', 'es'].forEach(lang => {
            if (translations[lang] && translations[lang].categoryNames && !translations[lang].categoryNames.hasOwnProperty(trimmedCatName)) {
                translations[lang].categoryNames[trimmedCatName] = trimmedCatName;
            }
        });
        if (!allCategoriesGlobal.includes(trimmedCatName)) {
            allCategoriesGlobal.push(trimmedCatName);
        }
    }
    return trimmedCatName;
}
function populateTranslationsFromData(data) {
    let identifiedCanonicalKeys = new Set();
    if (data && Array.isArray(data.categories)) {
        data.categories.forEach(catNameOrObj => {
            const catName = typeof catNameOrObj === 'string' ? catNameOrObj.trim() : (catNameOrObj?.name?.trim() || null);
            if (catName) identifiedCanonicalKeys.add(catName);
        });
    }
    const sujetsArray = data.sujets || data.passions;
    if (data && Array.isArray(sujetsArray)) {
        sujetsArray.forEach(item => {
            if (item.category) identifiedCanonicalKeys.add(item.category.trim());
        });
    }
    if (translations.fr && translations.fr.categoryNames) {
        Object.keys(translations.fr.categoryNames).forEach(key => identifiedCanonicalKeys.add(key));
    }
    ['fr', 'en', 'de', 'es'].forEach(lang => {
        if (!translations[lang]) translations[lang] = { categoryNames: {} };
        if (!translations[lang].categoryNames) translations[lang].categoryNames = {};
        identifiedCanonicalKeys.forEach(canonicalKey => {
            if (canonicalKey && !translations[lang].categoryNames.hasOwnProperty(canonicalKey)) {
                translations[lang].categoryNames[canonicalKey] = canonicalKey;
            }
        });
    });
}
function showToast(messageKey, type = 'info', duration = 3000) {
    let message = translations[currentLang]?.[messageKey] || messageKey;
    if (typeof message === 'function') {
      message = message('');
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message;
    toast.appendChild(messageSpan);
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.onclick = () => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); };
    toast.appendChild(closeBtn);
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { if (toast.parentElement) { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); } }, duration);
}
function updateSaveReminder() {
    if (dataHasBeenModified) {
        saveReminder.style.display = 'block';
        setTimeout(() => saveReminder.classList.add('visible'), 10);
    } else {
        saveReminder.classList.remove('visible');
        setTimeout(() => saveReminder.style.display = 'none', 300);
    }
}
function getTranslatedSujetName(sujet) { return sujet.name; }
function getTranslatedCategoryName(originalCategoryKey, targetLang = currentLang) {
    if (!originalCategoryKey || originalCategoryKey.trim() === "") {
        return translations[targetLang]?.unclassifiedCategory || "Unclassified";
    }
    return translations[targetLang]?.categoryNames?.[originalCategoryKey] || originalCategoryKey;
}
const categoryColorMap = {};
let fallbackColorIndex = 0;
let blackUsageCount = 0;
const specificCategoryColors = { "Animaux": "var(--color-animaux)", "Art": "var(--color-art)", "Aventure": "var(--color-aventure)", "Bien-Être": "var(--color-bien-etre)", "Science": "var(--color-science)", "Sport": "var(--color-sport)", "Musique": "var(--color-musique)", "Histoire": "var(--color-histoire)", "Technologie": "var(--color-technologie)", "Nature": "var(--color-nature)", "Litterature": "var(--color-litterature)", "Fiction": "var(--color-fiction)", "Média": "var(--color-media)", "Geographie": "var(--color-geographie)", "Jeux": "var(--color-jeux)", "Langue": "var(--color-langue)", "Mythologie": "var(--color-mythologie)", "Religion": "var(--color-religion)", "Education": "var(--color-education)", "Collection": "var(--color-collection)", "Transport": "var(--color-transport)", "Cuisine": "var(--color-cuisine)", "Culture": "var(--color-culture)", "Emotion": "var(--color-emotion)", "Loisir": "var(--color-loisir)", "Metier": "var(--color-metier)", "Espace": "var(--color-espace)", "Animals": "var(--color-animaux)", "Technology": "var(--color-technologie)", "Literature": "var(--color-litterature)", "Media": "var(--color-media)", "Geography": "var(--color-geographie)", "Games": "var(--color-jeux)", "Language": "var(--color-langue)", "Mythology": "var(--color-mythologie)", "Cooking": "var(--color-cuisine)", "Well-being": "var(--color-bien-etre)", "Leisure": "var(--color-loisir)", "Adventure": "var(--color-aventure)", "Profession": "var(--color-metier)", "Space": "var(--color-espace)" };
const fallbackColors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#f39c12", "#d35400", "#c0392b", "#5dade2", "#48c9b0", "#f5b041", "#ec7063", "#af7ac5", "#5499c7", "#45b39d", "#f8c471", "#dc7633", "#a569bd", "#5D6D7E", "#000000", "#34495e", "#000000"];
const ageColors = { 3: '#2ecc71', 4: '#3498db', 5: '#f1c40f', 6: '#e67e22', 7: '#9b59b6', 8: '#e74c3c', 9: '#1abc9c', 10: '#f39c12', 11: '#34495e', 12: '#7f8c8d' };
const defaultAgeColor = '#bdc3c7';
function getCategoryColor(categoryKey) {
    const normalizedCategoryKey = (categoryKey || "").trim();
    if (categoryColorMap[normalizedCategoryKey] && categoryColorMap[normalizedCategoryKey].custom) { return categoryColorMap[normalizedCategoryKey].color; }
    if (categoryColorMap[normalizedCategoryKey] && !categoryColorMap[normalizedCategoryKey].custom) { return categoryColorMap[normalizedCategoryKey].color; }
    let colorVar = specificCategoryColors[normalizedCategoryKey] || specificCategoryColors[translations['en']?.categoryNames?.[normalizedCategoryKey]] || specificCategoryColors[normalizedCategoryKey.charAt(0).toUpperCase() + normalizedCategoryKey.slice(1)];
    let resolvedColor;
    if (colorVar) {
        resolvedColor = colorVar.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(colorVar.slice(4, -1)).trim() : colorVar;
    } else {
        let attempts = 0;
        do {
            resolvedColor = fallbackColors[fallbackColorIndex % fallbackColors.length];
            fallbackColorIndex++;
            attempts++;
        }
        while ((resolvedColor === "#000000" || resolvedColor.toLowerCase() === "black" || resolvedColor === "rgb(0,0,0)") && blackUsageCount >= 2 && attempts < fallbackColors.length * 2);
        if (resolvedColor === "#000000" || resolvedColor.toLowerCase() === "black" || resolvedColor === "rgb(0,0,0)") {
            if (blackUsageCount < 2) {
                blackUsageCount++;
            } else if (attempts >= fallbackColors.length * 2) {
                resolvedColor = fallbackColors[0];
            }
        }
    }
    categoryColorMap[normalizedCategoryKey] = { color: resolvedColor, custom: false };
    return resolvedColor;
}
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggleButton.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggleButton.textContent = '🌙';
    }
    themeToggleButton.title = translations[currentLang]?.themeToggleLabel || "Changer de thème";
    localStorage.setItem('lookizTheme', theme);
    if (categoryChartInstance || ageChartInstance) { setTimeout(() => { generateGlobalCharts(_getFilteredSujetsByLanguage()); }, 50); }
}
function toggleTheme() {
    const currentTheme = localStorage.getItem('lookizTheme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}
function translatePage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (element.id === 'language-ui-dropdown-current-text' || element.id === 'translate-dropdown-current-text' || element.id === 'save-language-dropdown-current-text') return;
        let translation = translations[lang]?.[key] || translations['fr']?.[key] || key;
        if(typeof translation === 'function') {
            translation = translation('');
        }
        if (translation !== undefined) {
            let targetElement = element.querySelector('.text-label') || element;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (targetElement.placeholder) targetElement.placeholder = translation;
            } else {
                targetElement.textContent = translation;
            }
            if (element.hasAttribute('title')) element.title = translation;
            if (element.hasAttribute('aria-label')) element.setAttribute('aria-label', translation);
        }
    });
    document.querySelectorAll('[data-translate-placeholder-key]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder-key');
        const placeholderTranslation = translations[lang]?.[key] || translations['fr']?.[key] || key;
        if (placeholderTranslation) {
            element.placeholder = placeholderTranslation;
        }
    });
    refreshAllViews();
    updateCustomTranslateButtonDisplay(translationTargetLangSelect.value);
    updateCustomUiLangButtonDisplay(languageFilterSelect.value);
}
function updateAllCategoriesGlobal() {
    let collectedCanonicalKeys = new Set(allCategoriesGlobal);
    if (sujetsDataGlobal.some(p => p.category === "Populaire")) collectedCanonicalKeys.add("Populaire");
    sujetsDataGlobal.forEach(p => {
        if (p.category && p.category.trim() !== "") {
            collectedCanonicalKeys.add(p.category.trim());
        }
    });
    allCategoriesGlobal = [...collectedCanonicalKeys].sort((a, b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b), currentLang, { sensitivity: 'base' }));
}
function displayManagedCategories() {
    currentCategoriesListDiv.innerHTML = '';
    const sujetsPourLangueUI = _getFilteredSujetsByLanguage();
    const categoriesPresentInLang = new Set(sujetsPourLangueUI.map(p => p.category).filter(Boolean));
    const categoriesAffichees = [...categoriesPresentInLang].sort((a, b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b), currentLang, { sensitivity: 'base' }));
    if (categoriesAffichees.length === 0) {
        currentCategoriesListDiv.innerHTML = `<p class="message">${translations[currentLang]?.noCategoryToDisplay || "Aucune catégorie à afficher pour la langue sélectionnée."}</p>`;
        return;
    }
    categoriesAffichees.forEach((catKey) => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-managed-item';
        const tag = document.createElement('div');
        tag.className = 'category-tag';
        tag.style.backgroundColor = getCategoryColor(catKey);
        const iconSpan = document.createElement('span');
        iconSpan.className = 'category-tag-icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = categoryIcons[catKey] || defaultCategoryIcon;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'category-tag-name';
        nameSpan.textContent = getTranslatedCategoryName(catKey);
        tag.appendChild(iconSpan);
        tag.appendChild(nameSpan);
        categoryItem.appendChild(tag);
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.className = 'category-color-picker';
        colorPicker.value = getCategoryColor(catKey);
        colorPicker.title = `Choisir la couleur pour ${getTranslatedCategoryName(catKey)}`;
        colorPicker.addEventListener('input', (event) => {
            const newColor = event.target.value;
            categoryColorMap[catKey] = { color: newColor, custom: true };
            tag.style.backgroundColor = newColor;
            refreshAllViews();
            dataHasBeenModified = true;
            saveDataToLocalStorage();
        });
        categoryItem.appendChild(colorPicker);
        currentCategoriesListDiv.appendChild(categoryItem);
    });
}
function handleAddCategory() {
    const newCatNameKey = newCategoryNameInput.value.trim();
    if (!newCatNameKey) {
        showToast('categoryNameRequired', 'error');
        newCategoryNameInput.focus();
        return;
    }
    if (allCategoriesGlobal.some(catKey => catKey.toLowerCase() === newCatNameKey.toLowerCase())) {
        showToast('categoryAlreadyExists', 'error');
        return;
    }
    allCategoriesGlobal.push(newCatNameKey);
    Object.keys(translations).forEach(lang => {
        if (translations[lang] && translations[lang].categoryNames && !translations[lang].categoryNames[newCatNameKey]) {
            translations[lang].categoryNames[newCatNameKey] = newCatNameKey;
        }
    });
    newCategoryNameInput.value = '';
    newCategoryNameInput.dispatchEvent(new Event('input')); 
    dataHasBeenModified = true;
    showToast('categoryAdded', 'success');
    saveDataToLocalStorage();
    refreshAllViews();
}
function handleDeleteCategory(categoryKeyToDelete) {
    showToast('confirmDeleteCategory', 'info');
}
function refreshAllViews() {
    updateAllCategoriesGlobal();
    displayManagedCategories();
    displayCategorySelectorCards();
    updateQuickStats();
    populateFiltersAndSidebar();
    handleFilterChange();
    updateSaveReminder();
}
function openSaveOptionsModal() {
    document.getElementById('save-all-data').checked = true;
    saveCategorySelectorContainer.style.display = 'none';
    saveLanguageSelectorContainer.style.display = 'none';
    saveOptionsModal.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.getAttribute('data-translate-key');
        const translation = translations[currentLang]?.[key] || translations['fr']?.[key] || key;
        if (el.tagName === 'LABEL' || el.tagName === 'H3' || el.tagName === 'BUTTON') {
             el.textContent = translation;
        }
    });
    saveOptionsModal.classList.add('open');
    saveOptionsModal.style.display = 'flex';
}
function closeSaveOptionsModal() {
    saveOptionsModal.classList.remove('open');
    setTimeout(() => {
        saveOptionsModal.style.display = 'none';
    }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-normal').replace('s', '')) * 1000);
}
function populateSaveCategorySelect() {
    saveCategorySelect.innerHTML = '';
    const langOrder = ['fr', 'en', 'de', 'es'];
    const langLabels = { fr: 'Français', en: 'English', de: 'Deutsch', es: 'Español' };
    langOrder.forEach(lang => {
        const sujetsInLang = sujetsDataGlobal.filter(p => (p.language || 'fr') === lang);
        const categoryKeysInLang = [...new Set(sujetsInLang.map(p => p.category).filter(Boolean))];
        if (categoryKeysInLang.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = `-- ${langLabels[lang]} --`;
            const optionsForLang = categoryKeysInLang
                .map(canonicalKey => ({
                    key: canonicalKey,
                    lang: lang,
                    name: getTranslatedCategoryName(canonicalKey, lang),
                    icon: categoryIcons[canonicalKey] || defaultCategoryIcon
                }))
                .sort((a, b) => a.name.localeCompare(b.name, lang, { sensitivity: 'base' }));
            optionsForLang.forEach(cat => {
                const option = document.createElement('option');
                option.value = `${cat.key}|${cat.lang}`;
                option.textContent = `${cat.icon} ${cat.name}`;
                optgroup.appendChild(option);
            });
            saveCategorySelect.appendChild(optgroup);
        }
    });
    if (saveCategorySelect.options.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = translations[currentLang]?.noCategoryToDisplay || "Aucune catégorie disponible";
        option.disabled = true;
        saveCategorySelect.appendChild(option);
    }
}
function populateSaveLanguageSelect() {
    saveLanguageSelect.innerHTML = '';
    const allLanguageOptions = Array.from(languageFilterSelect.options);
    allLanguageOptions.forEach(langOption => {
        const langCode = langOption.value;
        const langName = langOption.textContent;
        if (!langCode || !langName) return;
        const option = document.createElement('option');
        option.value = langCode;
        option.textContent = langName;
        saveLanguageSelect.appendChild(option);
    });
    if (saveLanguageSelect.options.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = translations[currentLang]?.noLanguageFound || "Aucune langue disponible";
        option.disabled = true;
        saveLanguageSelect.appendChild(option);
    }
    initCustomSaveLangDropdown();
}
async function handleSaveWithOptions() {
    const selectedOption = document.querySelector('input[name="save-option"]:checked').value;
    closeSaveOptionsModal();
    if (selectedOption === 'all') {
        _downloadJSON(sujetsDataGlobal, [...allCategoriesGlobal], 'lookiz_sujets_data.json', true);
        return;
    }
    if (selectedOption === 'language') {
        const langToSave = saveLanguageSelect.value;
        if (!langToSave) {
            showToast(translations[currentLang]?.selectLanguageToSave || "Veuillez choisir une langue.", 'error');
            return;
        }
        const sujetsToSave = sujetsDataGlobal.filter(p => {
            if (langToSave === 'fr') {
                return !p.language || p.language === '' || p.language === 'fr';
            }
            return p.language === langToSave;
        });
        if (sujetsToSave.length === 0) {
            showToast(translations[currentLang]?.noSujetInLanguage || "Aucun sujet de discussion disponible dans cette langue.", 'info');
            return;
        }
        const presentCategories = [...new Set(sujetsToSave.map(p => p.category).filter(Boolean))];
        const fileName = `lookiz_sujets_${langToSave}.json`;
        _downloadJSON(sujetsToSave, presentCategories, fileName, false);
        const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langToSave)?.textContent || langToSave;
        showToast(`Sauvegarde de ${sujetsToSave.length} sujet(s) pour la langue '${langName}' réussie !`, 'success');
        return;
    }
    if (selectedOption === 'category') {
        const selectedValue = saveCategorySelect.value;
        if (!selectedValue) {
            showToast(translations[currentLang]?.selectCategoryToSave || "Veuillez choisir une catégorie.", 'error');
            return;
        }
        const [categoryKeyToSave, langToSaveForCategory] = selectedValue.split('|');
        const sujetsToSave = sujetsDataGlobal.filter(p => {
            const isCategoryMatch = p.category === categoryKeyToSave;
            if (!isCategoryMatch) return false;
            if (langToSaveForCategory === 'fr') {
                return !p.language || p.language === '' || p.language === 'fr';
            }
            return p.language === langToSaveForCategory;
        });
        if (sujetsToSave.length === 0) {
            showToast(translations[currentLang]?.noDataToDownload || 'Aucun sujet de discussion ne correspond à cette catégorie et cette langue.', 'info');
            return;
        }
        const categoriesToIncludeInJson = [categoryKeyToSave];
        const safeCategoryName = getTranslatedCategoryName(categoryKeyToSave, 'fr').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `lookiz_sujets_${safeCategoryName}_${langToSaveForCategory}.json`;
        _downloadJSON(sujetsToSave, categoriesToIncludeInJson, fileName, false);
        const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langToSaveForCategory)?.textContent || langToSaveForCategory;
        const catName = getTranslatedCategoryName(categoryKeyToSave, currentLang);
        showToast(`Sauvegarde de la catégorie '${catName}' en '${langName}' réussie !`, 'success');
    }
}
function _downloadJSON(sujetsArray, categoriesArray, filename, isFullSave) {
    const cleanedSujets = JSON.parse(JSON.stringify(sujetsArray)).map(p => {
        const sujetCopy = { ...p };
        delete sujetCopy.id;
        delete sujetCopy.Key;
        sujetCopy.minrecommandedAge = sujetCopy.minrecommandedAge !== undefined ? sujetCopy.minrecommandedAge : null;
        sujetCopy.maxrecommandedAge = sujetCopy.maxrecommandedAge !== undefined ? sujetCopy.maxrecommandedAge : null;
        if (sujetCopy.language === "fr" && (!sujetCopy.originalName_fr || sujetCopy.originalName_fr === sujetCopy.name)) {
            delete sujetCopy.language;
        }
        if (!sujetCopy.originalName_fr || sujetCopy.originalName_fr === sujetCopy.name) {
            delete sujetCopy.originalName_fr;
        }
        return sujetCopy;
    });
    const dataToDownload = {
        categories: categoriesArray,
        sujets: cleanedSujets
    };
    if (isFullSave) {
        const categoryMetadata = {};
        allCategoriesGlobal.forEach(catKey => {
            if (categoryColorMap[catKey] && categoryColorMap[catKey].custom) {
                if (categoriesArray.includes(catKey) || isFullSave) {
                    if (!categoryMetadata[catKey]) categoryMetadata[catKey] = {};
                    categoryMetadata[catKey].color = categoryColorMap[catKey].color;
                }
            }
        });
        if (Object.keys(categoryMetadata).length > 0) {
            dataToDownload.categoryMetadata = categoryMetadata;
        }
    }
    const jsonData = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (isFullSave) {
        dataHasBeenModified = false;
        updateSaveReminder();
    }
    saveDataToLocalStorage();
}
function resetAgeFilter() {
    if(minAgeFilterInput) minAgeFilterInput.value = '';
    if(maxAgeFilterInput) maxAgeFilterInput.value = '';
    handleFilterChange();
}
function _getFilteredSujetsByAge(sujetsToFilter) {
    const minAgeVal = minAgeFilterInput.value;
    const maxAgeVal = maxAgeFilterInput.value;
    const isAnyAgeChecked = ageAnyFilterCheckbox.checked;
    if (isAnyAgeChecked) {
        return sujetsToFilter.filter(sujet => sujet.minrecommandedAge === undefined && sujet.maxrecommandedAge === undefined);
    }
    const minAge = minAgeVal ? parseInt(minAgeVal, 10) : null;
    const maxAge = maxAgeVal ? parseInt(maxAgeVal, 10) : null;
    if (minAge === null && maxAge === null) {
        return sujetsToFilter;
    }
    return sujetsToFilter.filter(sujet => {
        if (sujet.minrecommandedAge === undefined && sujet.maxrecommandedAge === undefined) {
            return false; 
        }
        const sujetMin = sujet.minrecommandedAge !== undefined ? sujet.minrecommandedAge : 3;
        const sujetMax = sujet.maxrecommandedAge !== undefined ? sujet.maxrecommandedAge : 12;
        const passesMinFilter = (minAge === null) || (sujetMax >= minAge);
        const passesMaxFilter = (maxAge === null) || (sujetMin <= maxAge);
        return passesMinFilter && passesMaxFilter;
    });
}
function _getFilteredSujetsByLanguage() {
    const selectedUILang = languageFilterSelect.value;
    return sujetsDataGlobal.filter(sujet => {
        if (selectedUILang === 'fr') {
            return sujet.language === 'fr' || sujet.language === "" || !sujet.language;
        } else {
            return sujet.language === selectedUILang;
        }
    });
}
function _getFilteredSujetsBySearchTerm(sujetsToFilter, searchTerm) {
    if (!searchTerm) { return sujetsToFilter; }
    return sujetsToFilter.filter(sujet => getTranslatedSujetName(sujet).toLowerCase().includes(searchTerm));
}
function _getFilteredSujetsByCategory(categoryKeyToFilter, sujetsSource) {
    if (!categoryKeyToFilter || categoryKeyToFilter === "all" || categoryKeyToFilter === "all_explicit") { return sujetsSource; }
    return sujetsSource.filter(sujet => (sujet.category || "") === categoryKeyToFilter);
}
function handleAddSujetClick(prefillData = null) {
    const currentlyEditing = document.querySelector('.sujet-card.editing');
    if (currentlyEditing) {
        currentlyEditing.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Veuillez terminer l\'édition en cours avant d\'en ajouter une nouvelle.', 'info');
        return;
    }
    const preselectedCategory = prefillData 
        ? prefillData.category 
        : (explicitlySelectedCategoryKey && explicitlySelectedCategoryKey !== 'all' && explicitlySelectedCategoryKey !== 'all_explicit' ? explicitlySelectedCategoryKey : "");
    const prefilledName = prefillData ? prefillData.name : "";
    
    const tempSujet = {
        id: `new-sujet-${Date.now()}`,
        name: prefilledName,
        category: preselectedCategory,
        minrecommandedAge: undefined,
        maxrecommandedAge: undefined,
        language: currentLang
    };

    const newCardElement = document.createElement('div');
    newCardElement.className = 'sujet-card';
    newCardElement.id = `sujet-card-${tempSujet.id}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'sujet-card-content';
    newCardElement.appendChild(contentDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'sujet-card-actions';
    newCardElement.appendChild(actionsDiv);

    sujetsGrid.prepend(newCardElement);
    startEditSujet(tempSujet.id, newCardElement, true, tempSujet);

    newCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function duplicateSujet(sujetIdToDuplicate) {
    if (!confirm(translations[currentLang]?.confirmDuplicateSujet || "Dupliquer ce sujet de discussion ?")) return;
    const originalSujet = sujetsDataGlobal.find(p => p.id === sujetIdToDuplicate);
    if (!originalSujet) {
        showToast('errorSujetNotFoundEdit', 'error');
        return;
    }
    const newSujetId = `sujet-${nextSujetId++}`;
    const duplicatedSujet = JSON.parse(JSON.stringify(originalSujet));
    duplicatedSujet.id = newSujetId;
    duplicatedSujet.name = `${originalSujet.name} (Copie)`;
    if (duplicatedSujet.originalName_fr) {
        duplicatedSujet.originalName_fr = `${originalSujet.originalName_fr} (Copie)`;
    } else if (duplicatedSujet.language === 'fr' || !duplicatedSujet.language) {
        duplicatedSujet.originalName_fr = originalSujet.name;
    }
    duplicatedSujet.Key = generateSujetKey(duplicatedSujet.category, duplicatedSujet.originalName_fr || duplicatedSujet.name);
    sujetsDataGlobal.unshift(duplicatedSujet);
    dataHasBeenModified = true;
    saveDataToLocalStorage();
    showToast('sujetDuplicated', 'success');
    handleFilterChange();
    setTimeout(() => {
        const newCardElement = document.getElementById(`sujet-card-${newSujetId}`);
        if (newCardElement) {
            newCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newCardElement.classList.add('is-saving');
            setTimeout(() => newCardElement.classList.remove('is-saving'), 800);
        }
    }, 100);
}
function startEditSujet(sujetId, cardElement, isNew = false, tempSujet = null) {
    const sujet = isNew ? tempSujet : sujetsDataGlobal.find(p => p.id === sujetId);
    if (!sujet) {
        showToast('errorSujetNotFoundEdit', 'error');
        if(isNew) cardElement.remove();
        return;
    }
    const currentlyEditing = document.querySelector('.sujet-card.editing');
    if (currentlyEditing && currentlyEditing !== cardElement) {
        cancelEditSujet(currentlyEditing);
    }
    cardElement.classList.add('editing');
    cardElement.originalSujetData = JSON.parse(JSON.stringify(sujet));
    cardElement.isNewSujet = isNew;
    const contentDiv = cardElement.querySelector('.sujet-card-content');
    const actionsDiv = cardElement.querySelector('.sujet-card-actions');
    const titleBarExisting = cardElement.querySelector('.sujet-card-title-bar');
    if (titleBarExisting) titleBarExisting.remove();
    contentDiv.innerHTML = '';
    actionsDiv.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'sujet-card-edit-form';
    form.onsubmit = (e) => { e.preventDefault(); saveSujetEdit(cardElement); };
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', `edit-name-${sujet.id}`);
    nameLabel.textContent = translations[currentLang]?.labelName || "Nom :";
    form.appendChild(nameLabel);
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = `edit-name-${sujet.id}`;
    nameInput.value = sujet.name;
    nameInput.required = true;
    nameInput.placeholder = isNew ? (translations[currentLang]?.sujetNamesPlaceholder || "Nom du nouveau sujet") : "";
    form.appendChild(nameInput);
    const categoryLabel = document.createElement('label');
    categoryLabel.setAttribute('for', `edit-category-${sujet.id}`);
    categoryLabel.textContent = translations[currentLang]?.labelCategory || "Catégorie :";
    form.appendChild(categoryLabel);
    const categorySelectElement = document.createElement('select');
    categorySelectElement.id = `edit-category-${sujet.id}`;
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = translations[currentLang]?.selectCategoryPrompt || "Sélectionner une catégorie...";
    categorySelectElement.appendChild(defaultOption);
    const sujetsInCurrentLang = _getFilteredSujetsByLanguage();
    const availableCategoryKeys = [...new Set(sujetsInCurrentLang.map(p => p.category).filter(Boolean))];
    const sortedCategoriesForSelect = availableCategoryKeys.sort((a, b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b), currentLang, { sensitivity: 'base' }));
    sortedCategoriesForSelect.forEach(catKey => {
        const option = document.createElement('option');
        option.value = catKey;
        const icon = categoryIcons[catKey] || defaultCategoryIcon;
        option.textContent = `${icon} ${getTranslatedCategoryName(catKey)}`;
        if (sujet.category === catKey) option.selected = true;
        categorySelectElement.appendChild(option);
    });
    form.appendChild(categorySelectElement);
    const ageInputsDiv = document.createElement('div');
    ageInputsDiv.className = 'age-inputs';
    const minAgeDiv = document.createElement('div');
    const minAgeLabelForm = document.createElement('label');
    minAgeLabelForm.setAttribute('for', `edit-minage-${sujet.id}`);
    minAgeLabelForm.textContent = translations[currentLang]?.labelMinAge || "Âge min :";
    const minAgeInput = document.createElement('input');
    minAgeInput.type = 'number';
    minAgeInput.id = `edit-minage-${sujet.id}`;
    minAgeInput.min = "3";
    minAgeInput.max = "12";
    minAgeInput.value = sujet.minrecommandedAge !== undefined ? sujet.minrecommandedAge : "";
    minAgeDiv.appendChild(minAgeLabelForm);
    minAgeDiv.appendChild(minAgeInput);
    const maxAgeDiv = document.createElement('div');
    const maxAgeLabelForm = document.createElement('label');
    maxAgeLabelForm.setAttribute('for', `edit-maxage-${sujet.id}`);
    maxAgeLabelForm.textContent = translations[currentLang]?.labelMaxAge || "Âge max :";
    const maxAgeInput = document.createElement('input');
    maxAgeInput.type = 'number';
    maxAgeInput.id = `edit-maxage-${sujet.id}`;
    maxAgeInput.min = "3";
    maxAgeInput.max = "12";
    maxAgeInput.value = sujet.maxrecommandedAge !== undefined ? sujet.maxrecommandedAge : "";
    maxAgeDiv.appendChild(maxAgeLabelForm);
    maxAgeDiv.appendChild(maxAgeInput);
    ageInputsDiv.appendChild(minAgeDiv);
    ageInputsDiv.appendChild(maxAgeDiv);
    form.appendChild(ageInputsDiv);
    const anyAgeContainer = document.createElement('div');
    anyAgeContainer.className = 'any-age-checkbox-container';
    const anyAgeCheckboxForm = document.createElement('input');
    anyAgeCheckboxForm.type = 'checkbox';
    anyAgeCheckboxForm.id = `edit-anyage-${sujet.id}`;
    anyAgeCheckboxForm.checked = sujet.minrecommandedAge === undefined && sujet.maxrecommandedAge === undefined;
    const anyAgeLabel = document.createElement('label');
    anyAgeLabel.setAttribute('for', `edit-anyage-${sujet.id}`);
    anyAgeLabel.textContent = translations[currentLang]?.labelAnyAgeCheckbox || "Tout âge";
    anyAgeCheckboxForm.onchange = () => {
        minAgeInput.disabled = anyAgeCheckboxForm.checked;
        maxAgeInput.disabled = anyAgeCheckboxForm.checked;
        if (anyAgeCheckboxForm.checked) {
            minAgeInput.value = "";
            maxAgeInput.value = "";
        }
    };
    anyAgeCheckboxForm.onchange();
    anyAgeContainer.appendChild(anyAgeCheckboxForm);
    anyAgeContainer.appendChild(anyAgeLabel);
    form.appendChild(anyAgeContainer);
    contentDiv.appendChild(form);
    const saveButtonEl = document.createElement('button');
    saveButtonEl.type = 'button';
    saveButtonEl.className = 'btn-save';
    saveButtonEl.innerHTML = `<span class="icon" aria-hidden="true">💾</span> <span class="text-label">${translations[currentLang]?.saveButton || "Sauvegarder"}</span>`;
    saveButtonEl.onclick = () => saveSujetEdit(cardElement);
    const cancelButtonEl = document.createElement('button');
    cancelButtonEl.type = 'button';
    cancelButtonEl.className = 'btn-cancel';
    cancelButtonEl.innerHTML = `<span class="icon" aria-hidden="true">↩️</span> <span class="text-label">${translations[currentLang]?.cancelButton || "Annuler"}</span>`;
    cancelButtonEl.onclick = () => cancelEditSujet(cardElement);
    actionsDiv.appendChild(saveButtonEl);
    actionsDiv.appendChild(cancelButtonEl);
    nameInput.focus();
}
function saveSujetEdit(cardElement) {
    const isNew = cardElement.isNewSujet;
    const sujetId = cardElement.originalSujetData.id;
    const nameInput = cardElement.querySelector(`#edit-name-${sujetId}`);
    const categorySelectElement = cardElement.querySelector(`#edit-category-${sujetId}`);
    const minAgeInput = cardElement.querySelector(`#edit-minage-${sujetId}`);
    const maxAgeInput = cardElement.querySelector(`#edit-maxage-${sujetId}`);
    const anyAgeCheckboxForm = cardElement.querySelector(`#edit-anyage-${sujetId}`);
    const newName = nameInput.value.trim();
    if (!newName) {
        showToast('errorNameRequired', 'error');
        nameInput.focus();
        return;
    }
    const newCategoryKey = categorySelectElement.value;
    let newMinAge, newMaxAge;
    if (anyAgeCheckboxForm.checked) {
        newMinAge = undefined;
        newMaxAge = undefined;
    } else {
        const newMinAgeStr = minAgeInput.value.trim();
        const newMaxAgeStr = maxAgeInput.value.trim();
        newMinAge = newMinAgeStr === "" ? undefined : parseInt(newMinAgeStr, 10);
        newMaxAge = newMaxAgeStr === "" ? undefined : parseInt(newMaxAgeStr, 10);
        if ((newMinAgeStr !== "" && isNaN(newMinAge)) || (newMaxAgeStr !== "" && isNaN(newMaxAge))) {
            showToast('errorInvalidAge', 'error');
            return;
        }
        if (typeof newMinAge === 'number' && (newMinAge < 3 || newMinAge > 12)) {
            showToast('errorAgeMinTooLow', 'error');
            minAgeInput.focus();
            return;
        }
        if (typeof newMaxAge === 'number' && (newMaxAge < 3 || newMaxAge > 12)) {
            showToast('errorAgeMaxTooHigh', 'error');
            maxAgeInput.focus();
            return;
        }
        if (typeof newMinAge === 'number' && typeof newMaxAge === 'number' && newMinAge > newMaxAge) {
            showToast('errorMinMaxAge', 'error');
            return;
        }
    }
    if (isNew && typeof stringSimilarity !== 'undefined') {
        const existingSujetsInScope = sujetsDataGlobal.filter(p =>
            p.category === newCategoryKey &&
            (p.language === currentLang || (currentLang === 'fr' && (!p.language || p.language === 'fr')))
        );
        const existingNames = existingSujetsInScope.map(p => p.name);
        if (existingNames.length > 0) {
            const bestMatch = stringSimilarity.findBestMatch(newName, existingNames);
            if (bestMatch.bestMatch.rating > 0.80) {
                const confirmMsg = translations[currentLang].semanticDuplicateWarning(bestMatch.bestMatch.target);
                if (!confirm(confirmMsg)) {
                    nameInput.focus();
                    return;
                }
            }
        }
    }
    const nameForNewKey = (currentLang === 'fr') ? newName : (cardElement.originalSujetData.originalName_fr || newName);
    const newKey = generateSujetKey(newCategoryKey, nameForNewKey);
    const duplicateExists = sujetsDataGlobal.some(p =>
        p.Key === newKey &&
        (p.language === currentLang || (currentLang === 'fr' && (!p.language || p.language === 'fr'))) &&
        p.id !== sujetId
    );
    if (duplicateExists) {
        showToast('sujetAlreadyExists', 'error');
        nameInput.focus();
        return;
    }
    let savedSujetId;
    if (isNew) {
        const newSujet = {
            id: `sujet-${nextSujetId++}`,
            Key: newKey,
            name: newName,
            category: newCategoryKey,
            minrecommandedAge: newMinAge,
            maxrecommandedAge: newMaxAge,
            language: currentLang
        };
        if (currentLang === 'fr') {
            newSujet.originalName_fr = newName;
        }
        sujetsDataGlobal.unshift(newSujet);
        savedSujetId = newSujet.id;
    } else {
        const sujetToUpdate = sujetsDataGlobal.find(p => p.id === sujetId);
        if (!sujetToUpdate) {
            showToast('errorSujetNotFoundEdit', 'error');
            cardElement.remove();
            return;
        }
        sujetToUpdate.name = newName;
        sujetToUpdate.category = newCategoryKey;
        sujetToUpdate.minrecommandedAge = newMinAge;
        sujetToUpdate.maxrecommandedAge = newMaxAge;
        sujetToUpdate.language = currentLang;
        if (currentLang === 'fr') {
            sujetToUpdate.originalName_fr = newName;
        }
        sujetToUpdate.Key = generateSujetKey(sujetToUpdate.category, sujetToUpdate.originalName_fr || sujetToUpdate.name);
        savedSujetId = sujetToUpdate.id;
    }
    dataHasBeenModified = true;
    cardElement.classList.remove('editing');
    showToast(isNew ? 'sujetAdded' : 'sujetUpdated', 'success');
    saveDataToLocalStorage();
    refreshAllViews();
    setTimeout(() => {
        const savedCard = document.getElementById(`sujet-card-${savedSujetId}`);
        if (savedCard) {
            savedCard.classList.add('is-saving');
            setTimeout(() => savedCard.classList.remove('is-saving'), 800);
        }
    }, 50);
}
function cancelEditSujet(cardElement) {
    const isNew = cardElement.isNewSujet;
    cardElement.classList.remove('editing');
    if (isNew) {
        cardElement.remove();
    } else {
        refreshAllViews();
    }
}
function handleDeleteSujet(sujetId) {
    if (!confirm(translations[currentLang]?.confirmDeleteSujet || "Delete this topic?")) return;
    const cardElement = document.getElementById(`sujet-card-${sujetId}`);
    if (cardElement) {
        cardElement.classList.add('is-deleting');
        setTimeout(() => {
            const sujetIndex = sujetsDataGlobal.findIndex(p => p.id === sujetId);
            if (sujetIndex > -1) {
                sujetsDataGlobal.splice(sujetIndex, 1);
                dataHasBeenModified = true;
                saveDataToLocalStorage();
                showToast('sujetDeleted', 'info');
                refreshAllViews();
            } else {
                showToast('errorSujetNotFoundEdit', 'error');
                cardElement.classList.remove('is-deleting');
            }
        }, 800);
    } else {
        const sujetIndex = sujetsDataGlobal.findIndex(p => p.id === sujetId);
        if (sujetIndex > -1) {
            sujetsDataGlobal.splice(sujetIndex, 1);
            dataHasBeenModified = true;
            saveDataToLocalStorage();
            showToast('sujetDeleted', 'info');
            refreshAllViews();
        } else {
            showToast('errorSujetNotFoundEdit', 'error');
        }
    }
}
function displaySujets(sujetsToDisplay) {
    sujetsToDisplay.sort((a, b) => getTranslatedSujetName(a).localeCompare(getTranslatedSujetName(b), currentLang, { sensitivity: 'base' }));
    sujetsGrid.innerHTML = '';
    const searchTerm = searchSujetInput.value.trim();
    const isAgeFilterActive = minAgeFilterInput.value || maxAgeFilterInput.value;
    if (sujetsToDisplay.length === 0) {
        let messageTextKey = 'noSujetMatch';
        if (!isAgeFilterActive && explicitlySelectedCategoryKey === null && !searchTerm) {
            messageTextKey = 'promptSelectCategoryForSujets';
        }
        sujetsGrid.innerHTML = `<p class="message"><span class="message-icon">🤷</span> ${translations[currentLang]?.[messageTextKey] || "Aucun sujet à afficher."}</p>`;
        updateBulkActionsBar();
        return;
    }
    sujetsToDisplay.forEach((sujet, index) => {
        const card = document.createElement('div');
        card.className = 'sujet-card';
        card.id = `sujet-card-${sujet.id}`;
        card.style.animationDelay = `${index * 50}ms`;
        if (selectedSujetIds.has(sujet.id)) {
            card.classList.add('selected');
        }
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'sujet-card-checkbox';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `bulk-checkbox-${sujet.id}`;
        checkbox.dataset.sujetId = sujet.id;
        checkbox.checked = selectedSujetIds.has(sujet.id);
        const label = document.createElement('label');
        label.htmlFor = `bulk-checkbox-${sujet.id}`;
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        card.appendChild(checkboxContainer);
        card.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });    
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const id = e.target.dataset.sujetId;
            if (e.target.checked) {
                selectedSujetIds.add(id);
                card.classList.add('selected');
            } else {
                selectedSujetIds.delete(id);
                card.classList.remove('selected');
            }
            updateBulkActionsBar();
        });
        const rawCategoryKey = sujet.category || "";
        const displayCategoryName = getTranslatedCategoryName(rawCategoryKey);
        const categoryColor = getCategoryColor(rawCategoryKey);
        card.style.borderLeftColor = categoryColor;
        
        // Affiche le bouton de suppression pour TOUTES les cartes.
        const deleteCrossButton = document.createElement('button');
        deleteCrossButton.className = 'btn-delete-card';
        deleteCrossButton.innerHTML = `×`;
        deleteCrossButton.title = translations[currentLang]?.deleteButton || "Supprimer";
        deleteCrossButton.setAttribute('aria-label', deleteCrossButton.title);
        deleteCrossButton.onclick = (e) => { e.stopPropagation(); handleDeleteSujet(sujet.id); };
        card.appendChild(deleteCrossButton);

        // Crée la barre de titre et ses éléments
        const visualOverride = visualTranslationOverrides[sujet.id];
        const titleBar = document.createElement('div');
        titleBar.className = 'sujet-card-title-bar';
        
        const nameElement = document.createElement('h3');
        nameElement.style.color = categoryColor;
        nameElement.style.borderBottomColor = categoryColor;

        const tier = sujet.Tier !== undefined ? sujet.Tier : 0;
        const tierPill = document.createElement('span');
        tierPill.className = `sujet-tier-pill tier-${tier}`;
        const tierNames = { 0: 'tierFree', 1: 'tierSilver', 2: 'tierGold' };
        tierPill.title = translations[currentLang][tierNames[tier]] || ['Gratuit', 'Argent', 'Or'][tier];
        
        let langIndicator;
        if (visualOverride) {
            nameElement.textContent = visualOverride.name;
            langIndicator = document.createElement('span');
            langIndicator.className = 'sujet-card-lang-indicator override';
            langIndicator.textContent = visualOverride.lang.toUpperCase();
        } else {
            nameElement.textContent = getTranslatedSujetName(sujet);
            if (sujet.language && sujet.language.trim() !== "" && sujet.language !== 'fr') {
                langIndicator = document.createElement('span');
                langIndicator.className = 'sujet-card-lang-indicator';
                langIndicator.textContent = sujet.language;
            }
        }

        // Assemble la barre de titre dans le bon ordre
        titleBar.appendChild(nameElement);
        titleBar.appendChild(tierPill);
        if (langIndicator) {
            titleBar.appendChild(langIndicator);
        }
        card.appendChild(titleBar);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'sujet-card-content';
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.textContent = displayCategoryName;
        categoryElement.style.backgroundColor = categoryColor;
        contentDiv.appendChild(categoryElement);
        const ageInfoElement = document.createElement('div');
        ageInfoElement.className = 'age-info';
        const ageAnyText = translations[currentLang]?.ageAny || "Any age";
        const ageLabelText = translations[currentLang]?.ageLabel || "Age";
        const ageFromText = translations[currentLang]?.ageFrom || "From";
        const ageToText = translations[currentLang]?.ageTo || "Up to";
        const yearsSuffixText = translations[currentLang]?.yearsSuffix || "years";
        if (sujet.minrecommandedAge === undefined && sujet.maxrecommandedAge === undefined) {
            ageInfoElement.innerHTML = `<span class="no-age">${ageAnyText}</span>`;
        } else if (typeof sujet.minrecommandedAge === 'number' && typeof sujet.maxrecommandedAge === 'number') {
            ageInfoElement.innerHTML = `<span class="age">${ageLabelText}: ${sujet.minrecommandedAge} - ${sujet.maxrecommandedAge} ${yearsSuffixText}</span>`;
        } else if (typeof sujet.minrecommandedAge === 'number') {
            ageInfoElement.innerHTML = `<span class="age">${ageFromText}: ${sujet.minrecommandedAge} ${yearsSuffixText}</span>`;
        } else if (typeof sujet.maxrecommandedAge === 'number') {
            ageInfoElement.innerHTML = `<span class="age">${ageToText}: ${sujet.maxrecommandedAge} ${yearsSuffixText}</span>`;
        } else {
            ageInfoElement.innerHTML = `<span class="no-age">${ageAnyText}</span>`;
        }
        contentDiv.appendChild(ageInfoElement);
        card.appendChild(contentDiv);
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'sujet-card-actions';
        const editButtonText = translations[currentLang]?.editButton || "Edit";
        const duplicateButtonText = translations[currentLang]?.duplicateButton || "Duplicate";
        const translateButtonText = translations[currentLang]?.translateButton || "Traduire";
        const duplicateButton = document.createElement('button');
        duplicateButton.className = 'btn-duplicate';
        duplicateButton.innerHTML = `<span class="icon" aria-hidden="true">🐑</span> <span class="text-label">${duplicateButtonText}</span>`;
        duplicateButton.onclick = (e) => { e.stopPropagation(); duplicateSujet(sujet.id); };
        actionsDiv.appendChild(duplicateButton);
        const editButton = document.createElement('button');
        editButton.className = 'btn-edit';
        editButton.innerHTML = `<span class="icon" aria-hidden="true">✏️</span> <span class="text-label">${editButtonText}</span>`;
        editButton.onclick = (e) => { e.stopPropagation(); startEditSujet(sujet.id, card); };
        actionsDiv.appendChild(editButton);
        const translateButtonInActions = document.createElement('button');
        translateButtonInActions.className = 'btn-translate';
        translateButtonInActions.innerHTML = `<span class="icon" aria-hidden="true">🌐</span> <span class="text-label">${translateButtonText}</span>`;
        translateButtonInActions.onclick = (e) => { e.stopPropagation(); handleTranslateSujet(sujet.id, card); };
        actionsDiv.appendChild(translateButtonInActions);
        if (actionsDiv.hasChildNodes()) card.appendChild(actionsDiv);
        sujetsGrid.appendChild(card);
    });
    updateBulkActionsBar();
}
function updateBulkActionsBar() {
    const selectedCount = selectedSujetIds.size;
    if (selectedCount > 0) {
        bulkActionsInfo.innerHTML = `<strong>${selectedCount}</strong> <span data-translate-key="sujetsSelected">${translations[currentLang]?.sujetsSelected || 'sujets sélectionnés'}</span>`;
        bulkActionsBar.classList.add('visible');
    } else {
        bulkActionsBar.classList.remove('visible');
    }
}
function deselectAllSujets() {
    selectedSujetIds.clear();
    document.querySelectorAll('.sujet-card.selected').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.sujet-card-checkbox input:checked').forEach(cb => cb.checked = false);
    updateBulkActionsBar();
}
function openBulkChangeCategoryModal() {
    const selectedCount = selectedSujetIds.size;
    if (selectedCount === 0) return;
    document.getElementById('bulk-edit-category-modal-info').textContent = `${selectedCount} ${translations[currentLang]?.sujetsSelected || 'sujets sélectionnés'}`;
    bulkEditCategorySelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = translations[currentLang]?.selectCategoryPrompt || "Sélectionner une catégorie...";
    bulkEditCategorySelect.appendChild(defaultOption);
    const sujetsInCurrentLang = _getFilteredSujetsByLanguage();
    const availableCategoryKeys = [...new Set(sujetsInCurrentLang.map(p => p.category).filter(Boolean))];
    const sortedCategories = availableCategoryKeys.sort((a, b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b), currentLang, { sensitivity: 'base' }));
    sortedCategories.forEach(catKey => {
        const option = document.createElement('option');
        option.value = catKey;
        const icon = categoryIcons[catKey] || defaultCategoryIcon;
        option.textContent = `${icon} ${getTranslatedCategoryName(catKey)}`;
        bulkEditCategorySelect.appendChild(option);
    });
    bulkEditCategoryModal.style.display = 'flex';
    bulkEditCategoryModal.classList.add('open');
}
function openBulkChangeAgeModal() {
    const selectedCount = selectedSujetIds.size;
    if (selectedCount === 0) return;
    document.getElementById('bulk-edit-age-modal-info').textContent = `${selectedCount} ${translations[currentLang]?.sujetsSelected || 'sujets sélectionnés'}`;
    bulkMinAgeInput.value = '';
    bulkMaxAgeInput.value = '';
    bulkAnyAgeCheckbox.checked = false;
    bulkMinAgeInput.disabled = false;
    bulkMaxAgeInput.disabled = false;
    bulkEditAgeModal.style.display = 'flex';
    bulkEditAgeModal.classList.add('open');
}
function handleBulkDelete() {
    const selectedCount = selectedSujetIds.size;
    if (selectedCount === 0) return;
    const confirmMsg = (translations[currentLang]?.confirmBulkDelete || 'Voulez-vous vraiment supprimer les {count} sujets sélectionnés ?').replace('{count}', selectedCount);
    if (confirm(confirmMsg)) {
        sujetsDataGlobal = sujetsDataGlobal.filter(sujet => !selectedSujetIds.has(sujet.id));
        dataHasBeenModified = true;
        saveDataToLocalStorage();
        showToast((translations[currentLang]?.sujetsDeleted || '{count} sujets supprimés').replace('{count}', selectedCount), 'success');
        deselectAllSujets();
        handleFilterChange();
    }
}
function applyBulkCategoryChange() {
    const newCategoryKey = bulkEditCategorySelect.value;
    if (!newCategoryKey) {
        showToast('selectCategoryPrompt', 'error');
        return;
    }
    selectedSujetIds.forEach(id => {
        const sujet = sujetsDataGlobal.find(p => p.id === id);
        if (sujet) {
            sujet.category = newCategoryKey;
        }
    });
    dataHasBeenModified = true;
    saveDataToLocalStorage();
    showToast((translations[currentLang]?.categoryChangedSuccess || 'Catégorie changée pour {count} sujets').replace('{count}', selectedSujetIds.size), 'success');
    closeBulkModals();
    deselectAllSujets();
    handleFilterChange();
}
function applyBulkAgeChange() {
    let newMinAge, newMaxAge;
    if (bulkAnyAgeCheckbox.checked) {
        newMinAge = undefined;
        newMaxAge = undefined;
    } else {
        const minVal = bulkMinAgeInput.value.trim();
        const maxVal = bulkMaxAgeInput.value.trim();
        newMinAge = minVal ? parseInt(minVal, 10) : undefined;
        newMaxAge = maxVal ? parseInt(maxVal, 10) : undefined;
        if (typeof newMinAge === 'number' && (newMinAge < 3 || newMinAge > 12)) {
            showToast('errorAgeMinTooLow', 'error'); return;
        }
        if (typeof newMaxAge === 'number' && (newMaxAge < 3 || newMaxAge > 12)) {
            showToast('errorAgeMaxTooHigh', 'error'); return;
        }
        if (typeof newMinAge === 'number' && typeof newMaxAge === 'number' && newMinAge > newMaxAge) {
            showToast('errorMinMaxAge', 'error'); return;
        }
    }
    selectedSujetIds.forEach(id => {
        const sujet = sujetsDataGlobal.find(p => p.id === id);
        if (sujet) {
            sujet.minrecommandedAge = newMinAge;
            sujet.maxrecommandedAge = newMaxAge;
        }
    });
    dataHasBeenModified = true;
    saveDataToLocalStorage();
    showToast((translations[currentLang]?.ageChangedSuccess || 'Âge changé pour {count} sujets').replace('{count}', selectedSujetIds.size), 'success');
    closeBulkModals();
    deselectAllSujets();
    handleFilterChange();
}
function closeBulkModals() {
    bulkEditCategoryModal.style.display = 'none';
    bulkEditCategoryModal.classList.remove('open');
    bulkEditAgeModal.style.display = 'none';
    bulkEditAgeModal.classList.remove('open');
}
function updateActiveSidebarLink(selectedKey) {
    const isAgeOrSearchActive = minAgeFilterInput.value || maxAgeFilterInput.value || searchSujetInput.value.trim();
    document.querySelectorAll('#sidebar-category-list li a').forEach(link => {
        const linkRawCategoryKey = link.dataset.category;
        let isActive = false;
        if (isAgeOrSearchActive) {
             isActive = (linkRawCategoryKey === "all" && selectedKey === "all_explicit");
        } else {
            isActive = (linkRawCategoryKey === selectedKey) || (linkRawCategoryKey === "all" && selectedKey === null);
        }
        link.classList.toggle('active', isActive);
        link.style.borderLeftColor = (isActive && selectedKey && selectedKey !== 'all_explicit' && selectedKey !== null && !isAgeOrSearchActive) 
            ? getCategoryColor(selectedKey) 
            : 'transparent';
    });
}
function displayCategorySelectorCards() {
    const loaderHTML = `<div class="loader"></div><p class="sr-only">${translations[currentLang]?.loadingCategories || "Loading categories..."}</p>`;
    categorySelectionGrid.innerHTML = loaderHTML;
    setTimeout(() => {
        categorySelectionGrid.innerHTML = '';
        const sujetsInCurrentUILanguage = _getFilteredSujetsByLanguage();
        if (sujetsInCurrentUILanguage.length === 0) {
            categorySelectionGrid.innerHTML = `<p class="message">${translations[currentLang]?.noSujetInLanguage || "No topics available in this language."}</p>`;
            return;
        }
        const categoryCounts = {};
        sujetsInCurrentUILanguage.forEach(p => {
            const catKey = p.category || "";
            if (catKey) {
                categoryCounts[catKey] = (categoryCounts[catKey] || 0) + 1;
            }
        });
        const displayableCategoryKeys = Object.keys(categoryCounts).filter(key => categoryCounts[key] > 0);
        const sortedDisplayableCategoryKeys = displayableCategoryKeys.sort((a, b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b), currentLang, { sensitivity: 'base' }));
        if (sortedDisplayableCategoryKeys.length === 0) {
            categorySelectionGrid.innerHTML = `<p class="message">${translations[currentLang]?.noCategoryCardsToDisplay || "No categories to display."}</p>`;
            return;
        }
        sortedDisplayableCategoryKeys.forEach((rawCategoryKey, index) => {
            const card = document.createElement('div');
            card.className = 'category-selector-card';
            card.dataset.categoryKey = rawCategoryKey;
            card.style.animationDelay = `${index * 50}ms`;
            const translateIconButton = document.createElement('button');
            translateIconButton.className = 'btn-translate-icon-card';
            translateIconButton.innerHTML = `🌐`;
            translateIconButton.title = translations[currentLang]?.translateButtonCategory || "Traduire la catégorie";
            translateIconButton.addEventListener('click', (e) => {
                e.stopPropagation();
                handleTranslateCategoryPermanently([rawCategoryKey]);
            });
            card.appendChild(translateIconButton);
            const nameAndCountArea = document.createElement('div');
            nameAndCountArea.style.flexGrow = '1';
            nameAndCountArea.style.paddingTop = '10px';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = getTranslatedCategoryName(rawCategoryKey);
            nameAndCountArea.appendChild(nameSpan);
            const countSpan = document.createElement('span');
            countSpan.className = 'sujet-count';
            countSpan.textContent = ` (${categoryCounts[rawCategoryKey] || 0})`;
            nameAndCountArea.appendChild(countSpan);
            card.appendChild(nameAndCountArea);
            card.style.borderLeftColor = getCategoryColor(rawCategoryKey);
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'category-selector-card-buttons';
            const openButton = document.createElement('button');
            openButton.className = 'btn-open-category';
            const isSearchOrAgeActive = searchSujetInput.value.trim() || minAgeFilterInput.value || maxAgeFilterInput.value;
            const isOpen = explicitlySelectedCategoryKey === rawCategoryKey && !isSearchOrAgeActive;
            if (isOpen) {
                openButton.classList.add('active');
                openButton.innerHTML = `<span class="icon">▲</span> <span class="text-label">${translations[currentLang]?.closeCategoryButton || "Fermer la catégorie"}</span>`;
            } else {
                openButton.classList.remove('active');
                openButton.innerHTML = `<span class="icon">▼</span> <span class="text-label">${translations[currentLang]?.openCategoryButton || "Ouvrir la catégorie"}</span>`;
            }
            openButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const clickedKey = card.dataset.categoryKey;
                resetAgeFilter(); 
                if (explicitlySelectedCategoryKey === clickedKey && !searchSujetInput.value.trim()) {
                    explicitlySelectedCategoryKey = null;
                    categoryFilterSelect.value = "all";
                } else {
                    explicitlySelectedCategoryKey = clickedKey;
                    categoryFilterSelect.value = clickedKey;
                }
                searchSujetInput.value = '';
                handleFilterChange();
                if (explicitlySelectedCategoryKey !== null && document.getElementById('sujets-grid')) {
                    document.getElementById('sujets-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            buttonsContainer.appendChild(openButton);
            card.appendChild(buttonsContainer);
            categorySelectionGrid.appendChild(card);
        });
        updateActiveCategorySelectorCard();
    }, 50);
}
function handleRevertVisualTranslation(categoryKey) {
    let changesMade = false;
    sujetsDataGlobal.forEach(p => {
        if (p.category === categoryKey && visualTranslationOverrides[p.id]) {
            delete visualTranslationOverrides[p.id];
            changesMade = true;
        }
    });
    if (changesMade) {
        handleFilterChange();
        showToast('translationReverted', 'success');
    }
}
function updateActiveCategorySelectorCard() {
    const isSearchOrAgeActive = searchSujetInput.value.trim() || minAgeFilterInput.value || maxAgeFilterInput.value;
    document.querySelectorAll('.category-selector-card').forEach(card => {
        let isActive = card.dataset.categoryKey === explicitlySelectedCategoryKey && !isSearchOrAgeActive;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-selected', isActive.toString());
    });
}
function populateFiltersAndSidebar() {
    const firstFilterOption = categoryFilterSelect.options[0];
    firstFilterOption.textContent = translations[currentLang]?.selectCategoryPromptForFilter || "No category selected";
    firstFilterOption.value = "all";
    const secondFilterOption = categoryFilterSelect.options[1];
    secondFilterOption.textContent = translations[currentLang]?.allCategoriesFilter || "All categories";
    secondFilterOption.value = "all_explicit";
    while (categoryFilterSelect.options.length > 2) categoryFilterSelect.remove(2);
    const sujetsInCurrentLang = _getFilteredSujetsByLanguage();
    const availableCategoryKeys = [...new Set(sujetsInCurrentLang.map(p => p.category).filter(Boolean))];
    const sortedDisplayableCategoryKeys = availableCategoryKeys.sort((a, b) =>
        getTranslatedCategoryName(a, currentLang).localeCompare(getTranslatedCategoryName(b, currentLang), currentLang, { sensitivity: 'base' })
    );
    const sidebarCategoryLinks = sidebarCategoryList.querySelectorAll('li:not(:first-child)');
    sidebarCategoryLinks.forEach(li => li.remove());
    sortedDisplayableCategoryKeys.forEach(rawCategoryKey => {
        const displayCategoryName = getTranslatedCategoryName(rawCategoryKey, currentLang);
        const option = document.createElement('option');
        option.value = rawCategoryKey;
        const icon = categoryIcons[rawCategoryKey] || defaultCategoryIcon;
        option.textContent = `${icon} ${displayCategoryName}`;
        categoryFilterSelect.appendChild(option);
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#sujets-grid";
        const iconSpan = document.createElement('span');
        iconSpan.className = 'icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = icon;
        link.appendChild(iconSpan);
        const textSpan = document.createElement('span');
        textSpan.className = 'text-label';
        textSpan.textContent = displayCategoryName;
        link.appendChild(textSpan);
        link.dataset.category = rawCategoryKey;
        listItem.appendChild(link);
        sidebarCategoryList.appendChild(listItem);
        getCategoryColor(rawCategoryKey);
    });
    const isSearchOrAgeActive = searchSujetInput.value.trim() || minAgeFilterInput.value || maxAgeFilterInput.value;
    if (isSearchOrAgeActive) {
        categoryFilterSelect.value = "all_explicit";
    } else if (explicitlySelectedCategoryKey === null) {
        categoryFilterSelect.value = "all";
    } else if (explicitlySelectedCategoryKey === "all_explicit") {
        categoryFilterSelect.value = "all_explicit";
    } else if (Array.from(categoryFilterSelect.options).some(opt => opt.value === explicitlySelectedCategoryKey)) {
        categoryFilterSelect.value = explicitlySelectedCategoryKey;
    } else {
        explicitlySelectedCategoryKey = null;
        categoryFilterSelect.value = "all";
    }
}
function handleFilterChange() {
    const searchTerm = searchSujetInput.value.trim().toLowerCase();
    const isAgeFilterActive = minAgeFilterInput.value || maxAgeFilterInput.value;
    const bulkTransferBtn = document.getElementById('open-bulk-transfer-modal-btn'); 

    if (searchTerm || isAgeFilterActive) {
        if (gotoPopularLink) gotoPopularLink.classList.remove('active');
        if (explicitlySelectedCategoryKey !== "all_explicit") {
            explicitlySelectedCategoryKey = "all_explicit";
            if (categoryFilterSelect.value !== "all_explicit") categoryFilterSelect.value = "all_explicit";
        }
    }
    const sujetsInCurrentUILanguage = _getFilteredSujetsByLanguage();
    let sujetsFiltres = _getFilteredSujetsBySearchTerm(sujetsInCurrentUILanguage, searchTerm);
    sujetsFiltres = _getFilteredSujetsByAge(sujetsFiltres);

    let sujetsPourLaGrille = [];
    if (explicitlySelectedCategoryKey === null && !searchTerm && !isAgeFilterActive) {
        // Pas de filtre
    } else if (explicitlySelectedCategoryKey === "all_explicit" || searchTerm || isAgeFilterActive) {
        sujetsPourLaGrille = sujetsFiltres;
    } else {
        sujetsPourLaGrille = _getFilteredSujetsByCategory(explicitlySelectedCategoryKey, sujetsFiltres);
    }

    sujetsPourLaGrille = _getFilteredSujetsByTier(sujetsPourLaGrille);
    
    displaySujets(sujetsPourLaGrille);
    displayCategoryStats(sujetsPourLaGrille);
    displayCategorySelectorCards();
    updateActiveSidebarLink(explicitlySelectedCategoryKey);
    generateGlobalCharts(sujetsInCurrentUILanguage);
    updateQuickStats();
}
function displayCategoryStats(dataForStats) {
    const loaderHTML = `<div class="loader"></div><p class="sr-only">${translations[currentLang]?.calculatingStats || "Calculating stats..."}</p>`;
    categoryStatsContainer.innerHTML = loaderHTML;
    setTimeout(() => {
        categoryStatsContainer.innerHTML = '';
        if (!dataForStats || dataForStats.length === 0) {
            categoryStatsContainer.innerHTML = `<p class="message"><span class="message-icon">🤷</span> ${translations[currentLang]?.noSujetMatch || "No topic matches this filter."}</p>`;
            return;
        }
        const categoriesData = {};
        dataForStats.forEach(p => {
            const rawCatKey = p.category || "unclassified";
            if (!categoriesData[rawCatKey]) {
                categoriesData[rawCatKey] = { total: 0, withAge: 0, items: [] };
            }
            categoriesData[rawCatKey].total++;
            if (p.minrecommandedAge !== undefined || p.maxrecommandedAge !== undefined) {
                categoriesData[rawCatKey].withAge++;
            }
            categoriesData[rawCatKey].items.push(p);
        });
        const sortedRawCategoryKeys = Object.keys(categoriesData).sort((a, b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b), currentLang, { sensitivity: 'base' }));
        sortedRawCategoryKeys.forEach((rawCategoryKey, index) => {
            const categoryData = categoriesData[rawCategoryKey];
            const displayCategoryName = getTranslatedCategoryName(rawCategoryKey);
            const categoryColor = getCategoryColor(rawCategoryKey);
            const statBlock = document.createElement('div');
            statBlock.className = 'category-stat-block';
            statBlock.style.animationDelay = `${index * 0.05}s`;
            const title = document.createElement('h3');
            title.innerHTML = `${displayCategoryName} <span class="total-count">(${translations[currentLang]?.totalLabel}: ${categoryData.total})</span>`;
            title.style.borderBottomColor = categoryColor;
            statBlock.appendChild(title);
            const percentWithAge = categoryData.total > 0 ? (categoryData.withAge / categoryData.total) * 100 : 0;
            const ageSummaryContainer = document.createElement('div');
            ageSummaryContainer.className = 'age-summary-container';
            ageSummaryContainer.innerHTML = `
                <div class="age-summary-title">
                    <span>${translations[currentLang]?.statsAgeSummary || 'Sujets avec âge'}</span>
                    <span class="percent-value" style="color: #2ecc71;">${percentWithAge.toFixed(0)}%</span>
                </div>
                <div class="age-summary-bar">
                    <div class="filled-bar" style="width: ${percentWithAge}%; background-color: ${categoryColor};"></div>
                </div>`;
            statBlock.appendChild(ageSummaryContainer);
            const detailsWrapper = document.createElement('div');
            detailsWrapper.className = 'age-group-details';
            statBlock.appendChild(detailsWrapper);
            const detailsToggle = document.createElement('button');
            detailsToggle.className = 'age-details-toggle';
            detailsToggle.textContent = translations[currentLang]?.detailsToggle || 'Détails';
            detailsToggle.addEventListener('click', () => {
                const isOpen = detailsWrapper.classList.toggle('open');
                detailsToggle.classList.toggle('open', isOpen);
                if (isOpen && detailsWrapper.innerHTML === '') {
                    generateAgeDetails(detailsWrapper, categoryData.items, categoryColor);
                }
            });
            statBlock.appendChild(detailsToggle);
            categoryStatsContainer.appendChild(statBlock);
        });
    }, 50);
}
function formatAgeRangeForDisplay(min, max) {
    const yearsSuffix = translations[currentLang]?.yearsSuffix || "ans";
    if (min !== undefined && max !== undefined) {
        if (min === max) return `${min} ${yearsSuffix}`;
        return `${min} - ${max} ${yearsSuffix}`;
    }
    if (min !== undefined) return `${translations[currentLang]?.ageFrom || 'À partir de'} ${min} ${yearsSuffix}`;
    if (max !== undefined) return `${translations[currentLang]?.ageTo || 'Jusqu\'à'} ${max} ${yearsSuffix}`;
    return translations[currentLang]?.ageAny || "Tout âge";
}
function generateAgeDetails(container, items, categoryColor) {
    const ageGroups = {};
    const totalItemsInCategory = items.length;
    items.forEach(p => {
        const key = `${p.minrecommandedAge}_${p.maxrecommandedAge}`;
        if (!ageGroups[key]) {
            ageGroups[key] = { min: p.minrecommandedAge, max: p.maxrecommandedAge, names: [], count: 0 };
        }
        ageGroups[key].names.push(p.name);
        ageGroups[key].count++;
    });
    const sortedGroups = Object.values(ageGroups).sort((a, b) => {
        const minA = a.min === undefined ? 99 : a.min;
        const minB = b.min === undefined ? 99 : b.min;
        if (minA !== minB) return minA - minB;
        const maxA = a.max === undefined ? 99 : a.max;
        const maxB = b.max === undefined ? 99 : b.max;
        return maxA - maxB;
    });
    container.innerHTML = '';
    sortedGroups.forEach(group => {
        const { min, max, count, names } = group;
        const percentage = totalItemsInCategory > 0 ? ((count / totalItemsInCategory) * 100).toFixed(0) : 0;
        const ageGroupDiv = document.createElement('div');
        const ageTitle = document.createElement('h4');
        const sujetText = count > 1 ? (translations[currentLang]?.sujetsSuffix || 'sujets') : (translations[currentLang]?.sujetSuffix || 'sujet');
        const ageRangeText = formatAgeRangeForDisplay(min, max);
        ageTitle.innerHTML = `${ageRangeText} <span class="item-count-details">(${count} ${sujetText} - <span style="color: #2ecc71;">${percentage}%</span>)</span>`;
        ageGroupDiv.appendChild(ageTitle);
        const ul = document.createElement('ul');
        names.sort((a, b) => a.localeCompare(b, currentLang, { sensitivity: 'base' })).forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            ul.appendChild(li);
        });
        ageGroupDiv.appendChild(ul);
        container.appendChild(ageGroupDiv);
    });
}
function generateGlobalCharts(dataForCharts) {
    const categoryChartContainerEl = document.getElementById('category-chart-container').querySelector('.canvas-container');
    const ageChartContainerEl = document.getElementById('age-chart-container').querySelector('.canvas-container');
    const loadingMsgKey = 'loadingCharts';
    const loadingTextForSR = translations[currentLang]?.[loadingMsgKey] || "Loading charts...";
    const loaderHTML = `<div class="loader"></div><p class="sr-only">${loadingTextForSR}</p>`;
    if (categoryChartContainerEl) categoryChartContainerEl.innerHTML = loaderHTML;
    if (ageChartContainerEl) ageChartContainerEl.innerHTML = loaderHTML;
    if (categoryChartInstance) categoryChartInstance.destroy();
    if (ageChartInstance) ageChartInstance.destroy();
    categoryChartInstance = null;
    ageChartInstance = null;
    blackUsageCount = 0;
    setTimeout(() => {
        if (categoryChartContainerEl) categoryChartContainerEl.innerHTML = '';
        if (ageChartContainerEl) ageChartContainerEl.innerHTML = '';
        if (!dataForCharts || dataForCharts.length === 0) {
            const noDataMsg = `<p class="message">${translations[currentLang]?.errorLoadingCharts || "Data unavailable for the chart."}</p>`;
            if (categoryChartContainerEl) categoryChartContainerEl.innerHTML = noDataMsg;
            if (ageChartContainerEl) ageChartContainerEl.innerHTML = noDataMsg;
            return;
        }
        const categoryCanvas = document.createElement('canvas');
        categoryCanvas.id = "globalCategoryChart";
        categoryCanvas.setAttribute('role', 'img');
        categoryCanvas.setAttribute('aria-label', translations[currentLang]?.discoveriesByCategoryChartTitle || 'Topics by Category Chart');
        if (categoryChartContainerEl) categoryChartContainerEl.appendChild(categoryCanvas);
        const categoryCounts = {};
        
        dataForCharts
            .filter(item => item.category !== "Populaire") 
            .forEach(item => {
                const rawCategoryKey = item.category || "";
                categoryCounts[rawCategoryKey] = (categoryCounts[rawCategoryKey] || 0) + 1;
            });
        const sortedCategoryEntries = Object.entries(categoryCounts).sort(([keyA], [keyB]) => 
            getTranslatedCategoryName(keyA).localeCompare(getTranslatedCategoryName(keyB), currentLang, { sensitivity: 'base' })
        );
        const categoryChartLabels = sortedCategoryEntries.map(entry => getTranslatedCategoryName(entry[0]));
        const categoryChartDataValues = sortedCategoryEntries.map(entry => entry[1]);
        blackUsageCount = 0;
        const originalCategoryBackgroundColors = sortedCategoryEntries.map(entry => getCategoryColor(entry[0]));
        const chartDiscoveriesLabelText = translations[currentLang]?.chartDiscoveriesLabel || "Topics by Category";
        categoryChartInstance = new Chart(categoryCanvas, {
            type: 'pie',
            data: {
                labels: categoryChartLabels,
                datasets: [{
                    label: chartDiscoveriesLabelText,
                    data: categoryChartDataValues,
                    backgroundColor: [...originalCategoryBackgroundColors],
                    borderColor: originalCategoryBackgroundColors.map(color => Chart.helpers.color(color).darken(0.1).rgbString()),
                    borderWidth: 1,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 800, easing: 'easeInOutQuart' },
                onHover: (event, chartElement) => {
                    const chart = event.chart;
                    chart.data.datasets[0].backgroundColor = [...originalCategoryBackgroundColors];
                    if (chartElement.length > 0) {
                        const hoveredIndex = chartElement[0].index;
                        chart.data.datasets[0].backgroundColor.forEach((color, index) => {
                            if (index !== hoveredIndex) {
                                chart.data.datasets[0].backgroundColor[index] = Chart.helpers.color(color).alpha(0.2).rgbString();
                            }
                        });
                    }
                    chart.update();
                },
                plugins: {
                    datalabels: {
                        display: false
                    },
                    legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                            color: document.body.classList.contains('dark-theme') ? '#FFFFFF' : '#2c3e50',
                            boxWidth: 12,
                            padding: 10,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) { label += ': '; }
                                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) + '%' : '0%';
                                if (context.parsed !== null) { label += context.parsed + ' (' + percentage + ')'; }
                                return label;
                            }
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const clickedElementIndex = elements[0].index;
                        const rawCategoryClicked = sortedCategoryEntries[clickedElementIndex][0];
                        resetAgeFilter();
                        explicitlySelectedCategoryKey = rawCategoryClicked;
                        categoryFilterSelect.value = rawCategoryClicked;
                        searchSujetInput.value = '';
                        handleFilterChange();
                        if (window.innerWidth < 992 && sidebar.classList.contains('open')) closeSidebar();
                        const sujetsGridElement = document.getElementById('sujets-grid');
                        if (sujetsGridElement) {
                            const delay = (window.innerWidth < 992 && sidebar.classList.contains('open')) ? (parseFloat(getComputedStyle(sidebar).getPropertyValue('--sidebar-transition-speed').replace('s', '')) * 1000) + 100 : 50;
                            setTimeout(() => sujetsGridElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), delay);
                        }
                    }
                }
            }
        });
        const ageCanvas = document.createElement('canvas');
        ageCanvas.id = "globalAgeChart";
        ageCanvas.setAttribute('role', 'img');
        ageCanvas.setAttribute('aria-label', translations[currentLang]?.distributionByAgeChartTitle || 'Distribution by Age Chart');
        if (ageChartContainerEl) ageChartContainerEl.appendChild(ageCanvas);
        const ageDistribution = {};
        const possibleNumericAges = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let countAnyAge = 0;
        possibleNumericAges.forEach(age => ageDistribution[age] = 0);
        dataForCharts.forEach(item => {
            const minAge = item.minrecommandedAge;
            const maxAge = item.maxrecommandedAge;
            if (minAge === undefined && maxAge === undefined) {
                countAnyAge++;
            } else {
                possibleNumericAges.forEach(currentAge => {
                    let isInRange = false;
                    if (typeof minAge === 'number' && typeof maxAge === 'number') {
                        isInRange = (currentAge >= minAge && currentAge <= maxAge);
                    } else if (typeof minAge === 'number') {
                        isInRange = (currentAge >= minAge);
                    } else if (typeof maxAge === 'number') {
                        isInRange = (currentAge <= maxAge);
                    }
                    if (isInRange) ageDistribution[currentAge]++;
                });
            }
        });
        const yearsSuffixText = translations[currentLang]?.yearsSuffix || "years";
        const ageAnyText = translations[currentLang]?.ageAny || "Any age";
        const chartNumberOfDiscoveriesText = translations[currentLang]?.chartNumberOfDiscoveries || "Number of Topics";
        const ageChartLabels = possibleNumericAges.map(age => `${age} ${yearsSuffixText}`);
        const ageCounts = possibleNumericAges.map(age => ageDistribution[age]);
        const ageBarColors = possibleNumericAges.map(age => ageColors[age] || defaultAgeColor);
        if (countAnyAge > 0) {
            ageChartLabels.push(ageAnyText);
            ageCounts.push(countAnyAge);
            ageBarColors.push(defaultAgeColor);
        }
        ageChartInstance = new Chart(ageCanvas, {
            type: 'bar',
            data: {
                labels: ageChartLabels,
                datasets: [{
                    label: chartNumberOfDiscoveriesText,
                    data: ageCounts,
                    backgroundColor: ageBarColors,
                    borderColor: ageBarColors.map(color => Chart.helpers.color(color).darken(0.15).rgbString()),
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 800, easing: 'easeOutBounce' },
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
                    const chart = event.chart;
                    chart.data.datasets[0].backgroundColor = [...ageBarColors];
                    if (chartElement.length > 0) {
                        const hoveredIndex = chartElement[0].index;
                        chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
                            if (index !== hoveredIndex) {
                                colors[index] = Chart.helpers.color(color).alpha(0.2).rgbString();
                            }
                        });
                    }
                    chart.update();
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: document.body.classList.contains('dark-theme') ? '#FFFFFF' : '#2c3e50',
                            stepSize: Math.max(1, Math.ceil(Math.max(...ageCounts, 1) / 8)) || 1
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim(),
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: { color: document.body.classList.contains('dark-theme') ? '#FFFFFF' : '#2c3e50', },
                        grid: { display: false }
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        bodyFont: {
                            size: 14
                        },
                        padding: 10,
                        cornerRadius: 6
                    }
                }
            }
        });
    }, 100);
}
function animateCounter(element, targetValue, animationIdVariable) {
    if (animationIdVariable) {
        clearInterval(animationIdVariable);
    }
    let currentValue = parseInt(element.textContent, 10) || 0;
    const duration = 700;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = (targetValue - currentValue) / steps;
    if (targetValue === currentValue || (Math.abs(targetValue - currentValue) < 1 && targetValue !== 0)) {
        element.textContent = targetValue;
        return null;
    }
    let currentStep = 0;
    const intervalId = setInterval(() => {
        currentValue += increment;
        currentStep++;
        if (currentStep >= steps) {
            currentValue = targetValue;
            clearInterval(intervalId);
        }
        element.textContent = Math.round(currentValue);
    }, stepTime);
    return intervalId;
}
function updateQuickStats() {
    const sujetsInCurrentLanguage = _getFilteredSujetsByLanguage();
    quickStatsSujetsAnimationId = animateCounter(quickStatsTotalSujetsEl, sujetsInCurrentLanguage.length, quickStatsSujetsAnimationId);
    
    const uniqueCategoriesInLang = [...new Set(sujetsInCurrentLanguage.map(p => p.category || "").filter(catKey => catKey && catKey.trim() !== ""))];
    
    quickStatsCategoriesAnimationId = animateCounter(quickStatsTotalCategoriesEl, uniqueCategoriesInLang.length, quickStatsCategoriesAnimationId);
}
function openSidebar() {
    sidebar.classList.add('open');
    document.body.classList.add('sidebar-is-open');
    if (window.innerWidth >= 992) {
        contentPusher.style.marginRight = 'var(--sidebar-width)';
        topNavbar.style.marginRight = 'var(--sidebar-width)';
    } else {
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = 1, 10);
    }
}
function closeSidebar() {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-is-open');
    contentPusher.style.marginRight = '0';
    topNavbar.style.marginRight = '0';
    overlay.style.opacity = 0;
    setTimeout(() => overlay.style.display = 'none', parseFloat(getComputedStyle(overlay).getPropertyValue('transition-duration')) * 1000);
}
function handleNavLinkClick(e, targetId) {
    e.preventDefault();
    const isSmallScreen = window.innerWidth < 992;
    if (isSmallScreen && sidebar.classList.contains('open')) closeSidebar();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const delay = (isSmallScreen && sidebar.classList.contains('open')) ? (parseFloat(getComputedStyle(sidebar).getPropertyValue('--sidebar-transition-speed').replace('s', '')) * 1000) + 50 : 0;
        setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), delay);
    }
}
function updateCustomTranslateButtonDisplay(langCode) {
    const selectedOption = Array.from(translationTargetLangSelect.options).find(opt => opt.value === langCode);
    if (selectedOption) {
        translateDropdownCurrentText.textContent = selectedOption.textContent;
        if (languageFlags[langCode]) {
            translateDropdownCurrentFlag.src = languageFlags[langCode];
            translateDropdownCurrentFlag.alt = `Drapeau ${selectedOption.textContent}`;
            translateDropdownCurrentFlag.style.display = 'inline-block';
        } else {
            translateDropdownCurrentFlag.style.display = 'none';
        }
    } else {
        translateDropdownCurrentText.textContent = (translations[currentLang] && translations[currentLang].customTranslateDropdownDefaultText) ? translations[currentLang].customTranslateDropdownDefaultText : "Traduire en...";
        translateDropdownCurrentFlag.style.display = 'none';
    }
    if (translateDropdownCurrentText.dataset.translateKey === "customTranslateDropdownDefaultText" && (!langCode || !Array.from(translationTargetLangSelect.options).find(opt => opt.value === langCode))) {
        translateDropdownCurrentText.textContent = (translations[currentLang] && translations[currentLang].customTranslateDropdownDefaultText) ? translations[currentLang].customTranslateDropdownDefaultText : "Traduire en...";
    }
}
function initCustomTranslateDropdown() {
    if (!customTranslateDropdownContainer || !translationTargetLangSelect || !translateDropdownToggle || !translateDropdownMenuList) {
        console.error("Un ou plusieurs éléments du dropdown de traduction personnalisé sont manquants.");
        return;
    }
    const targetLanguagesOptions = Array.from(translationTargetLangSelect.options).map(opt => ({ value: opt.value, name: opt.textContent, flag: languageFlags[opt.value] || "" }));
    translateDropdownMenuList.innerHTML = '';
    targetLanguagesOptions.forEach(lang => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'menuitem');
        listItem.dataset.value = lang.value;
        if (lang.flag) {
            const flagImg = document.createElement('img');
            flagImg.src = lang.flag;
            flagImg.alt = `Drapeau ${lang.name}`;
            flagImg.className = 'flag-icon';
            listItem.appendChild(flagImg);
        }
        listItem.appendChild(document.createTextNode(lang.name));
        listItem.addEventListener('click', () => {
            translationTargetLangSelect.value = lang.value;
            translationTargetLangSelect.dispatchEvent(new Event('change'));
            updateCustomTranslateButtonDisplay(lang.value);
            customTranslateDropdownContainer.classList.remove('open');
            translateDropdownToggle.classList.remove('open');
            translateDropdownToggle.setAttribute('aria-expanded', 'false');
            translateDropdownMenuList.style.display = 'none';
        });
        translateDropdownMenuList.appendChild(listItem);
    });
    translateDropdownToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = customTranslateDropdownContainer.classList.toggle('open');
        translateDropdownToggle.classList.toggle('open', isOpen);
        translateDropdownToggle.setAttribute('aria-expanded', isOpen.toString());
        translateDropdownMenuList.style.display = isOpen ? 'block' : 'none';
    });
    customTranslateDropdownContainer.addEventListener('mouseenter', () => {
        clearTimeout(translateDropdownTimeout);
        if (!customTranslateDropdownContainer.classList.contains('open')) {
            customTranslateDropdownContainer.classList.add('open');
            translateDropdownToggle.classList.add('open');
            translateDropdownToggle.setAttribute('aria-expanded', 'true');
            translateDropdownMenuList.style.display = 'block';
        }
    });
    customTranslateDropdownContainer.addEventListener('mouseleave', () => {
        translateDropdownTimeout = setTimeout(() => {
            customTranslateDropdownContainer.classList.remove('open');
            translateDropdownToggle.classList.remove('open');
            translateDropdownToggle.setAttribute('aria-expanded', 'false');
            translateDropdownMenuList.style.display = 'none';
        }, 300);
    });
    updateCustomTranslateButtonDisplay(translationTargetLangSelect.value);
}
function updateCustomUiLangButtonDisplay(langCode) {
    const selectedOption = Array.from(languageFilterSelect.options).find(opt => opt.value === langCode);
    if (selectedOption && languageUiDropdownCurrentText && languageUiDropdownCurrentFlag) {
        languageUiDropdownCurrentText.textContent = selectedOption.textContent;
        if (languageFlags[langCode]) {
            languageUiDropdownCurrentFlag.src = languageFlags[langCode];
            languageUiDropdownCurrentFlag.alt = `Drapeau ${selectedOption.textContent}`;
            languageUiDropdownCurrentFlag.style.display = 'inline-block';
        } else {
            languageUiDropdownCurrentFlag.style.display = 'none';
        }
    } else if (languageUiDropdownCurrentText) {
        const defaultLangOption = languageFilterSelect.options[0];
        languageUiDropdownCurrentText.textContent = defaultLangOption ? defaultLangOption.textContent : "Français";
        if (languageUiDropdownCurrentFlag && defaultLangOption && languageFlags[defaultLangOption.value]) {
            languageUiDropdownCurrentFlag.src = languageFlags[defaultLangOption.value];
            languageUiDropdownCurrentFlag.style.display = 'inline-block';
        } else if (languageUiDropdownCurrentFlag) {
            languageUiDropdownCurrentFlag.style.display = 'none';
        }
    }
}
function initCustomUiLangDropdown() {
    if (!customUiLangDropdownContainer || !languageFilterSelect || !languageUiDropdownToggle || !languageUiDropdownMenuList) {
        console.error("Un ou plusieurs éléments du dropdown de langue UI sont manquants.");
        return;
    }
    const uiLanguagesOptions = Array.from(languageFilterSelect.options).map(opt => ({ value: opt.value, name: opt.textContent, flag: languageFlags[opt.value] || "" }));
    languageUiDropdownMenuList.innerHTML = '';
    uiLanguagesOptions.forEach(lang => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'menuitem');
        listItem.dataset.value = lang.value;
        if (lang.flag) {
            const flagImg = document.createElement('img');
            flagImg.src = lang.flag;
            flagImg.alt = `Drapeau ${lang.name}`;
            flagImg.className = 'flag-icon';
            listItem.appendChild(flagImg);
        }
        listItem.appendChild(document.createTextNode(lang.name));
        listItem.addEventListener('click', () => {
            const previousLang = languageFilterSelect.value;
            languageFilterSelect.value = lang.value;
            updateCustomUiLangButtonDisplay(lang.value);
            customUiLangDropdownContainer.classList.remove('open');
            languageUiDropdownToggle.classList.remove('open');
            languageUiDropdownToggle.setAttribute('aria-expanded', 'false');
            languageUiDropdownMenuList.style.display = 'none';
            if (previousLang !== lang.value) {
                languageFilterSelect.dispatchEvent(new Event('change'));
            }
        });
        languageUiDropdownMenuList.appendChild(listItem);
    });
    languageUiDropdownToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = customUiLangDropdownContainer.classList.toggle('open');
        languageUiDropdownToggle.classList.toggle('open', isOpen);
        languageUiDropdownToggle.setAttribute('aria-expanded', isOpen.toString());
        languageUiDropdownMenuList.style.display = isOpen ? 'block' : 'none';
    });
    customUiLangDropdownContainer.addEventListener('mouseenter', () => {
        clearTimeout(languageUiDropdownTimeout);
        if (!customUiLangDropdownContainer.classList.contains('open')) {
            customUiLangDropdownContainer.classList.add('open');
            languageUiDropdownToggle.classList.add('open');
            languageUiDropdownToggle.setAttribute('aria-expanded', 'true');
            languageUiDropdownMenuList.style.display = 'block';
        }
    });
    customUiLangDropdownContainer.addEventListener('mouseleave', () => {
        languageUiDropdownTimeout = setTimeout(() => {
            customUiLangDropdownContainer.classList.remove('open');
            translateDropdownToggle.classList.remove('open');
            translateDropdownToggle.setAttribute('aria-expanded', 'false');
            languageUiDropdownMenuList.style.display = 'none';
        }, 300);
    });
    updateCustomUiLangButtonDisplay(languageFilterSelect.value);
}
function updateCustomSaveLangButtonDisplay(langCode) {
    const selectedOption = Array.from(saveLanguageSelect.options).find(opt => opt.value === langCode);
    if (selectedOption && saveLanguageDropdownCurrentText && saveLanguageDropdownCurrentFlag) {
        saveLanguageDropdownCurrentText.textContent = selectedOption.textContent;
        if (languageFlags[langCode]) {
            saveLanguageDropdownCurrentFlag.src = languageFlags[langCode];
            saveLanguageDropdownCurrentFlag.alt = `Drapeau ${selectedOption.textContent}`;
            saveLanguageDropdownCurrentFlag.style.display = 'inline-block';
        } else {
            saveLanguageDropdownCurrentFlag.style.display = 'none';
        }
    } else if (saveLanguageDropdownCurrentText) {
        saveLanguageDropdownCurrentText.textContent = translations[currentLang]?.selectLanguageToSave || "Choisir une langue :";
        if (saveLanguageDropdownCurrentFlag) {
            saveLanguageDropdownCurrentFlag.style.display = 'none';
        }
    }
}
function initCustomSaveLangDropdown() {
    const container = document.getElementById('custom-save-lang-dropdown-container');
    const select = document.getElementById('save-language-select');
    const toggle = document.getElementById('save-language-dropdown-toggle');
    const menuList = document.getElementById('save-language-dropdown-menu-list');
    if (!container || !select || !toggle || !menuList) {
        console.error("Un ou plusieurs éléments du dropdown de sauvegarde de langue sont manquants.");
        return;
    }
    const saveLanguagesOptions = Array.from(select.options).map(opt => ({
        value: opt.value, name: opt.textContent, flag: languageFlags[opt.value] || ""
    }));
    menuList.innerHTML = '';
    saveLanguagesOptions.forEach(lang => {
        if (!lang.value) return;
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'menuitem');
        listItem.dataset.value = lang.value;
        if (lang.flag) {
            const flagImg = document.createElement('img');
            flagImg.src = lang.flag;
            flagImg.alt = `Drapeau ${lang.name}`;
            flagImg.className = 'flag-icon';
            listItem.appendChild(flagImg);
        }
        listItem.appendChild(document.createTextNode(lang.name));
        listItem.addEventListener('click', () => {
            select.value = lang.value;
            updateCustomSaveLangButtonDisplay(lang.value);
            container.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            menuList.style.display = 'none';
        });
        menuList.appendChild(listItem);
    });
    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = container.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen.toString());
        menuList.style.display = isOpen ? 'block' : 'none';
    });
    let saveLanguageDropdownTimeout;
    container.addEventListener('mouseenter', () => {
        clearTimeout(saveLanguageDropdownTimeout);
        if (!container.classList.contains('open')) {
            container.classList.add('open');
            toggle.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            menuList.style.display = 'block';
        }
    });
    container.addEventListener('mouseleave', () => {
        saveLanguageDropdownTimeout = setTimeout(() => {
            container.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            menuList.style.display = 'none';
        }, 300);
    });
    
    updateCustomSaveLangButtonDisplay(select.value);
}
function formatSecondsToTime(seconds) {
    if (seconds < 60) { return `~ ${seconds}s`; }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `~ ${minutes}min ${remainingSeconds}s`;
}
function updateRealTimeEstimate() {
    if (translationStartTime === 0 || totalEstimatedSeconds === 0) return;
    const timeEstimateEl = document.getElementById('translation-time-estimate');
    if (!timeEstimateEl) {
        clearInterval(timeEstimateIntervalId);
        return;
    }
    const elapsedTimeInSeconds = (Date.now() - translationStartTime) / 1000;
    const remainingTimeInSeconds = Math.max(0, totalEstimatedSeconds - elapsedTimeInSeconds);
    timeEstimateEl.textContent = `(${(translations[currentLang]?.estimatedTime || "Temps estimé")}: ${formatSecondsToTime(Math.round(remainingTimeInSeconds))})`;
}
function showTranslationProgress(totalItems) {
    if (translationProgressContainer && translationProgressBar && translationProgressTextInfo) {
        translationProgressBar.classList.remove('cancelled');
        translationProgressBar.style.backgroundColor = 'var(--color-translate)';
        translationProgressBar.style.width = '0%';
        translationProgressBar.setAttribute('aria-valuenow', '0');
        const progressTextKey = translations[currentLang]?.translationProgressText || "{completed} / {total} Translated";
        const initialText = progressTextKey.replace('{completed}', '0').replace('{total}', totalItems);
        translationProgressTextInfo.textContent = initialText;
        translationProgressBar.setAttribute('data-progress-text', '0%');
        const timeEstimateEl = document.getElementById('translation-time-estimate');
        if (totalItems > 0 && timeEstimateEl) {
            const timePerBatch = 1.2;
            const delayBetweenBatches = 0.2;
            const numBatches = Math.ceil(totalItems / CONCURRENT_TRANSLATIONS_LIMIT);
            const totalApiTime = numBatches * timePerBatch;
            const totalDelayTime = (numBatches > 1) ? (numBatches - 1) * delayBetweenBatches : 0;
            totalEstimatedSeconds = Math.round(totalApiTime + totalDelayTime);
            translationStartTime = Date.now();
            updateRealTimeEstimate();
            if (timeEstimateIntervalId) clearInterval(timeEstimateIntervalId);
            timeEstimateIntervalId = setInterval(updateRealTimeEstimate, 1000);
        }
        translationProgressContainer.style.display = 'flex';
    }
}
function updateTranslationProgress(completedItems, totalItems) {
    if (translationProgressContainer && translationProgressBar && translationProgressTextInfo && totalItems > 0) {
        const percentage = Math.round((completedItems / totalItems) * 100);
        translationProgressBar.style.width = percentage + '%';
        translationProgressBar.setAttribute('aria-valuenow', percentage);
        const progressTextKey = translations[currentLang]?.translationProgressText || "{completed} / {total} Translated";
        const currentText = progressTextKey.replace('{completed}', completedItems).replace('{total}', totalItems);
        translationProgressTextInfo.textContent = currentText;
        translationProgressBar.setAttribute('data-progress-text', `${percentage}%`);
    }
}
function hideTranslationProgress() {
    if (timeEstimateIntervalId) {
        clearInterval(timeEstimateIntervalId);
        timeEstimateIntervalId = null;
    }
    translationStartTime = 0;
    totalEstimatedSeconds = 0;
    if (translationProgressContainer && translationProgressBar && translationProgressTextInfo) {
        const timeEstimateEl = document.getElementById('translation-time-estimate');
        if (!isTranslationCancelled) {
            const textInfoContent = translationProgressTextInfo.textContent || "0 / 0";
            const parts = textInfoContent.split('/');
            const total = parseInt(parts[1], 10) || 0;
            translationProgressBar.style.width = '100%';
            translationProgressBar.setAttribute('aria-valuenow', '100');
            translationProgressBar.setAttribute('data-progress-text', '100%');
            if (total > 0) {
                const progressTextKey = translations[currentLang]?.translationProgressText || "{completed} / {total} Translated";
                translationProgressTextInfo.textContent = progressTextKey.replace('{completed}', total).replace('{total}', total);
            }
            if (timeEstimateEl) {
                timeEstimateEl.textContent = `(${translations[currentLang]?.translationCompleted || 'Terminé !'})`;
            }
        }
        const hideDelay = isTranslationCancelled ? 500 : 1200;
        setTimeout(() => {
            translationProgressContainer.style.display = 'none';
            if (timeEstimateEl) timeEstimateEl.textContent = '';
            translationProgressBar.classList.remove('cancelled');
            translationProgressBar.style.backgroundColor = 'var(--color-translate)';
            translationProgressBar.style.width = '0%';
            translationProgressBar.setAttribute('aria-valuenow', '0');
            translationProgressBar.setAttribute('data-progress-text', '0%');
            translationProgressTextInfo.textContent = '0 / 0';
        }, hideDelay);
    }
}
function openTranslateCategoriesModal() {
    isTranslationCancelled = false;
    translationProgressBar.classList.remove('cancelled');
    translationProgressBar.style.backgroundColor = 'var(--color-translate)';
    translationProgressContainer.style.display = 'none';
    const visibleSujets = _getFilteredSujetsByLanguage();
    const uniqueVisibleCategories = [...new Set(visibleSujets.map(p => p.category).filter(Boolean))].sort((a, b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b), currentLang));
    translateCategoriesModalList.innerHTML = '';
    if (uniqueVisibleCategories.length === 0) {
        translateCategoriesModalList.innerHTML = `<p>${translations[currentLang]?.noCategoryCardsToDisplay || 'Aucune catégorie à traduire.'}</p>`;
        translateCategoriesSelectAllBtn.disabled = true;
        translateCategoriesConfirmBtn.disabled = true;
    } else {
        uniqueVisibleCategories.forEach(catKey => {
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `cb-cat-${catKey}`;
            checkbox.value = catKey;
            checkbox.checked = true;
            const label = document.createElement('label');
            label.htmlFor = `cb-cat-${catKey}`;
            label.textContent = getTranslatedCategoryName(catKey);
            div.appendChild(checkbox);
            div.appendChild(label);
            translateCategoriesModalList.appendChild(div);
        });
        translateCategoriesSelectAllBtn.disabled = false;
        translateCategoriesConfirmBtn.disabled = false;
        translateCategoriesSelectAllBtn.textContent = translations[currentLang]?.deselectAllCategoriesBtn || "Tout Désélectionner";
        translateCategoriesSelectAllBtn.dataset.selected = "true";
    }
    translateCategoriesModal.classList.add('open');
    translateCategoriesModal.style.display = 'flex';
}
function closeTranslateCategoriesModal() {
    translateCategoriesModal.classList.remove('open');
    setTimeout(() => {
        translateCategoriesModal.style.display = 'none';
    }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-normal').replace('s', '')) * 1000);
}
function toggleSelectAllCategoriesModal() {
    const checkboxes = translateCategoriesModalList.querySelectorAll('input[type="checkbox"]');
    const allSelected = translateCategoriesSelectAllBtn.dataset.selected === "true";
    checkboxes.forEach(cb => cb.checked = !allSelected);
    translateCategoriesSelectAllBtn.dataset.selected = (!allSelected).toString();
    translateCategoriesSelectAllBtn.textContent = !allSelected ? (translations[currentLang]?.deselectAllCategoriesBtn || "Tout Désélectionner") : (translations[currentLang]?.selectAllCategoriesBtn || "Tout Sélectionner");
}
function handleTranslateSelectedCategories() {
    const selectedCategoriesKeys = Array.from(translateCategoriesModalList.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    if (selectedCategoriesKeys.length === 0) {
        showToast('noSujetsSelectedToTranslate', 'info');
        return;
    }
    closeTranslateCategoriesModal();
    handleTranslateCategoryPermanently(selectedCategoriesKeys);
}
async function translateSingleSujet(sujet, targetLang, sourceLang) {
    if (!sujet || !sujet.name) return null;
    const textToTranslate = sujet.name;
    const sourceLangForAPI = sourceLang;
    if (sourceLangForAPI === targetLang) {
        return { ...sujet, language: targetLang };
    }
    const translatedName = await translateTextOpenRouter(textToTranslate, sourceLangForAPI, targetLang);
    if (translatedName && translatedName.toLowerCase() !== textToTranslate.toLowerCase()) {
        const newSujet = { ...JSON.parse(JSON.stringify(sujet)), name: translatedName, language: targetLang };
        delete newSujet.id;
        return newSujet;
    }
    return null;
}
function getOpenRouterApiKey() {
    const validKeys = OPENROUTER_API_KEYS.filter(key => key && key.startsWith("sk-or-v1-") && key.length > 10);
    if (validKeys.length === 0) {
        console.error("Aucune clé API OpenRouter valide configurée.");
        showToast('translationErrorApiKey', 'error');
        return null;
    }
    return validKeys;
}
async function translateTextOpenRouter(textToTranslate, sourceLang = 'fr', targetLang = 'en') {
    if (!textToTranslate || textToTranslate.trim() === "") return textToTranslate;
    if (sourceLang === targetLang) return textToTranslate;
    const validKeys = getOpenRouterApiKey();
    if (!validKeys) return null;
    const maxRetries = 3;
    const initialDelay = 1000;
    const model = "mistralai/mistral-7b-instruct";
    const prompt = `You are a silent translation API. Translate the following word or short phrase from ${sourceLang} to ${targetLang}. Your response MUST contain ONLY the translated text. Do NOT add any notes, explanations, disclaimers, plurals, or any other text. Do NOT use quotation marks. Word to translate: "${textToTranslate}"`;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = validKeys[(currentApiKeyIndex + attempt) % validKeys.length];
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": OPENROUTER_REFERRER,
                    "X-Title": OPENROUTER_APP_TITLE
                },
                body: JSON.stringify({
                    "model": model,
                    "messages": [{ "role": "user", "content": prompt }],
                    "temperature": 0.1,
                    "max_tokens": Math.max(100, textToTranslate.length * 3)
                })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0].message && data.choices[0].message.content) {
                    let rawTranslation = data.choices[0].message.content.trim();
                    let cleanedTranslation = rawTranslation.split('\n')[0].replace(/^(.*?is:|.*?:\s*)/i, '').replace(/\s*\(.*\)/g, '').replace(/^["'«“]|["'»”]$/g, '');
                    currentApiKeyIndex = (currentApiKeyIndex + attempt) % validKeys.length;
                    return cleanedTranslation.trim();
                }
            }
            console.warn(`Tentative ${attempt + 1} échouée pour "${textToTranslate}". Statut: ${response.status}`);
        } catch (error) {
            console.warn(`Tentative ${attempt + 1} échouée pour "${textToTranslate}" (erreur réseau). Erreur:`, error);
        }
        if (attempt < maxRetries - 1) {
            const delay = initialDelay * Math.pow(2, attempt);
            console.log(`Nouvelle tentative dans ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    console.error(`Échec définitif de la traduction pour "${textToTranslate}" après ${maxRetries} tentatives.`);
    return null;
}
async function handleTranslateSujet(sujetId, cardElement) {
    if (!cardElement) return;
    const translateButton = cardElement.querySelector('.sujet-card-title-bar .btn-translate');
    if (translateButton) translateButton.disabled = true;
    const targetLang = translationTargetLangSelect.value;
    if (!targetLang || targetLang === currentLang) {
        showToast('customTranslateDropdownDefaultText', 'error');
        if (translateButton) translateButton.disabled = false;
        return;
    }
    const sujet = sujetsDataGlobal.find(p => p.id === sujetId);
    if (!sujet) {
        showToast('errorSujetNotFoundEdit', 'error');
        if (translateButton) translateButton.disabled = false;
        return;
    }
    if (sujetsDataGlobal.some(p => p.Key === sujet.Key && p.language === targetLang)) {
        showToast('sujetAlreadyTranslated', 'info');
        if (translateButton) translateButton.disabled = false;
        return;
    }
    const sourceLangForAPI = sujet.language || 'fr';
    try {
        const newSujetObject = await translateSingleSujet(sujet, targetLang, sourceLangForAPI);
        if (newSujetObject) {
            sujetsDataGlobal.unshift(newSujetObject);
            dataHasBeenModified = true;
            saveDataToLocalStorage();
            refreshAllViews();
            const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === targetLang)?.textContent || targetLang;
            showToast(translations[currentLang].translationSuccessSingle.replace('{langName}', langName), 'success', 5000);
        } else {
            showToast('translationError', 'error');
        }
    } catch (error) {
        console.error("Erreur dans handleTranslateSujet:", error);
        showToast('translationError', 'error');
    } finally {
        if (translateButton) translateButton.disabled = false;
    }
}
function handleTransferSujet(sujetId) {
    const sujet = sujetsDataGlobal.find(p => p.id === sujetId);
    if (!sujet || !transferTierModal) {
        showToast('errorSujetNotFoundEdit', 'error');
        return;
    }
    
    transferTierModal.dataset.sujetId = sujetId;
    transferTierModalTitle.textContent = `${translations[currentLang].bulkTransferButton || 'Transférer'} : "${sujet.name}"`;

    const currentTier = sujet.Tier !== undefined ? sujet.Tier : 0;
    const allTiers = [
        { id: 0, key: 'tierFree', name: 'Gratuit' },
        { id: 1, key: 'tierSilver', name: 'Argent' },
        { id: 2, key: 'tierGold', name: 'Or' }
    ];

    const currentTierDisplay = document.getElementById('current-tier-display');
    const destinationChoices = document.getElementById('destination-tier-choices').querySelector('.choices-wrapper');
    
    currentTierDisplay.innerHTML = `<span class="flow-label" data-translate-key="currentTierLabel">${translations[currentLang].currentTierLabel || 'Tier Actuel'}</span>`;
    destinationChoices.innerHTML = '';

    allTiers.forEach(tier => {
        const button = document.createElement('button');
        button.className = 'tier-filter-btn';
        button.dataset.tier = tier.id;
        
        button.innerHTML = ''; // <-- On retire l'emoji
        button.title = translations[currentLang][tier.key] || tier.name;
        
        if (tier.id === currentTier) {
            button.classList.add('current');
            currentTierDisplay.appendChild(button);
        } else {
            button.classList.add('btn-tier-choice');
            button.addEventListener('click', () => {
                confirmTierTransfer(sujetId, tier.id);
            });
            destinationChoices.appendChild(button);
        }
    });

    transferTierModal.classList.add('open');
    transferTierModal.style.display = 'flex';
}

async function handleTranslateAllVisibleSujets() {
    openTranslateCategoriesModal();
}
const LOCAL_STORAGE_KEY = 'lookizSujetsData';
function saveDataToLocalStorage() {
    try {
        const dataToStore = {
            sujets: sujetsDataGlobal,
            categories: allCategoriesGlobal,
            nextId: nextSujetId,
            categoryColors: {}
        };
        for (const catKey in categoryColorMap) {
            if (categoryColorMap[catKey].custom) {
                dataToStore.categoryColors[catKey] = categoryColorMap[catKey].color;
            }
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
        console.log("Données sauvegardées localement.");
    } catch (e) {
        console.error("Erreur lors de la sauvegarde dans localStorage:", e);
        showToast('errorSavingToLocalStorage', 'error');
    }
}
function confirmTierTransfer(sujetId, newTier) {
    const sujet = sujetsDataGlobal.find(p => p.id === sujetId);
    if (!sujet) return;
    
    const tierNames = { 0: 'Gratuit', 1: 'Argent', 2: 'Or' };
    const destinationName = translations[currentLang][`tier${['Free', 'Silver', 'Gold'][newTier]}`] || tierNames[newTier];

    sujet.Tier = newTier;
    dataHasBeenModified = true;
    saveDataToLocalStorage();
    closeTransferTierModal();
    showToast(`Sujet '${sujet.name}' transféré vers '${destinationName}' !`, 'success');
    handleFilterChange();
}
function closeTransferTierModal() {
    if (!transferTierModal) return;
    transferTierModal.classList.remove('open');
    setTimeout(() => {
        transferTierModal.style.display = 'none';
        delete transferTierModal.dataset.sujetId;
    }, 300);
}
function loadDataFromLocalStorage() {
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const sujetsArray = parsedData.sujets || parsedData.passions;
            if (parsedData && Array.isArray(sujetsArray) && Array.isArray(parsedData.categories)) {
                initializeApp(parsedData);
                showToast('dataRestoredFromLocalStorage', 'success');
                return true;
            }
        }
    } catch (e) {
        console.error("Erreur lors de la restauration depuis localStorage:", e);
        showToast('errorRestoringFromLocalStorage', 'error');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return false;
}
function openBulkTransferModal() {
    if (!bulkTransferModal) return;
        const sujetIdsVisibles = Array.from(sujetsGrid.querySelectorAll('.sujet-card')).map(card => card.id.replace('sujet-card-', ''));
        const sujetsVisibles = sujetsDataGlobal.filter(sujet => sujetIdsVisibles.includes(sujet.id));
    ;

    bulkTransferSubjectList.innerHTML = '';
    if (sujetsVisibles.length === 0) {
        bulkTransferSubjectList.innerHTML = `<p class="message">${translations[currentLang]?.noSujetsToTransfer || "Aucun sujet à transférer."}</p>`;
        bulkTransferSelectAllBtn.disabled = true;
        bulkTransferConfirmBtn.disabled = true;
    } else {
        sujetsVisibles.sort((a,b) => a.name.localeCompare(b.name)).forEach(sujet => {
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `cb-bulk-${sujet.id}`;
            checkbox.value = sujet.id;
            checkbox.checked = true;
            
            const label = document.createElement('label');
            label.htmlFor = `cb-bulk-${sujet.id}`;
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = sujet.name;
            const tier = sujet.Tier !== undefined ? sujet.Tier : 0;
            const tierPill = document.createElement('span');
            tierPill.classList.add('sujet-tier-pill', `tier-${tier}`);
            
            const tierIcons = { 0: '🎁', 1: '🥈', 2: '🥇' };
            tierPill.innerHTML = '';
            
            const tierNames = { 0: 'tierFree', 1: 'tierSilver', 2: 'tierGold' };
            tierPill.title = translations[currentLang][tierNames[tier]] || ['Gratuit', 'Argent', 'Or'][tier];
            label.appendChild(nameSpan);
            label.appendChild(tierPill);

            div.appendChild(checkbox);
            div.appendChild(label);
            bulkTransferSubjectList.appendChild(div);
        });
        bulkTransferSelectAllBtn.disabled = false;
        bulkTransferConfirmBtn.disabled = false;
        bulkTransferSelectAllBtn.textContent = translations[currentLang]?.deselectAllBtn || "Tout Désélectionner";
        bulkTransferSelectAllBtn.dataset.selected = "true";
    }
    document.getElementById('bulk-tier-0').checked = true;
    bulkTransferModal.classList.add('open');
    bulkTransferModal.style.display = 'flex';
}
function closeBulkTransferModal() {
    if (!bulkTransferModal) return;
    bulkTransferModal.classList.remove('open');
    setTimeout(() => {
        bulkTransferModal.style.display = 'none';
    }, 300);
}
function toggleSelectAllBulkTransfer() {
    const checkboxes = bulkTransferSubjectList.querySelectorAll('input[type="checkbox"]');
    const allSelected = bulkTransferSelectAllBtn.dataset.selected === "true";
    checkboxes.forEach(cb => cb.checked = !allSelected);
    bulkTransferSelectAllBtn.dataset.selected = (!allSelected).toString();
    bulkTransferSelectAllBtn.textContent = !allSelected 
        ? (translations[currentLang]?.deselectAllBtn || "Tout Désélectionner") 
        : (translations[currentLang]?.selectAllBtn || "Tout Sélectionner");
}
function handleBulkTransfer() {
    const selectedIds = Array.from(bulkTransferSubjectList.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    if (selectedIds.length === 0) {
        showToast('noSujetsToTransfer', 'info');
        return;
    }
    const newTier = parseInt(document.querySelector('input[name="bulk-transfer-tier"]:checked').value, 10);
    let subjectsUpdated = 0;
    sujetsDataGlobal.forEach(sujet => {
        if (selectedIds.includes(sujet.id)) {
            sujet.Tier = newTier;
            subjectsUpdated++;
        }
    });
    if (subjectsUpdated > 0) {
        dataHasBeenModified = true;
        saveDataToLocalStorage();
        showToast('selectionTransferred', 'success');
    }
    closeBulkTransferModal();
    handleFilterChange();
}
function openLangHubModal() {
    if (!langHubModal) return;
    
    langHubModal.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.getAttribute('data-translate-key');
        const translation = translations[currentLang]?.[key] || key;
        const textLabel = el.querySelector('.text-label') || el.querySelector('span:not(.icon)') || el;
        if (textLabel && (textLabel.tagName !== 'INPUT')) {
             textLabel.textContent = translation;
        } else if (el.classList.contains('versus-placeholder')) {
             el.textContent = translation;
        }
    });
    switchHubTab(hubNavButtons[0]);
    langHubModal.classList.add('open');
    langHubModal.style.display = 'flex';
}
function closeLangHubModal() {
    if (!langHubModal) return;
    langHubModal.classList.remove('open');
    
    setTimeout(() => {
        langHubModal.style.display = 'none';
        
        if (worldMapChartInstance) {
            worldMapChartInstance.destroy();
            worldMapChartInstance = null;
        }
         if (topLanguagesChartInstance) {
            topLanguagesChartInstance.destroy();
            topLanguagesChartInstance = null;
        }
    }, 300);
}
function switchHubTab(targetButton) {
    if (!targetButton) return; 
    const targetPanelSelector = targetButton.dataset.targetPanel;
    if (!targetPanelSelector) return;
    const targetPanel = document.querySelector(targetPanelSelector);
    if (!targetPanel) {
        console.error(`Panneau cible introuvable : ${targetPanelSelector}`);
        return;
    }
    if (worldMapChartInstance) worldMapChartInstance.destroy();
    if (topLanguagesChartInstance) topLanguagesChartInstance.destroy();
    worldMapChartInstance = null;
    topLanguagesChartInstance = null;
    hubNavButtons.forEach(btn => btn.classList.remove('active'));
    targetButton.classList.add('active');
    hubContentPanels.forEach(panel => panel.classList.remove('active'));
    targetPanel.classList.add('active');
    
    loadDataForPanel(targetPanelSelector);
}
function loadDataForPanel(panelSelector) {
    switch (panelSelector) {
        case '#versus-view-panel':
            setupVersusControls();
            displayVersusComparison();
            break;
        case '#global-stats-view-panel':
            displayGlobalView();
            break;
        case '#advanced-stats-view-panel':
            setupAdvancedStatsControls();
            displayAdvancedStats();
            break;
    }
}
function updateAllVersusLabels() {
    const wrappers = versusControls.querySelectorAll('.lang-selector-wrapper');
    wrappers.forEach((wrapper, index) => {
        const label = wrapper.querySelector('label');
        if (label) {
            label.textContent = `${(translations[currentLang]?.langStatsLang1 || 'Langue')} ${index + 1}`;
        }
    });
}
function setupVersusControls() {
    const controlsContainer = document.getElementById('versus-controls-container');
    if (!controlsContainer) return;
    
    controlsContainer.innerHTML = '';
    versusControls = document.createElement('div');
    versusControls.id = 'versus-controls';
    controlsContainer.appendChild(versusControls);
    addVersusSelector(false, 'fr');
    addVersusSelector(false, 'en');
    addCompetitorBtn = document.createElement('button');
    addCompetitorBtn.id = 'add-competitor-btn';
    addCompetitorBtn.className = 'btn-add-competitor';
    const buttonText = translations[currentLang]?.addCompetitor || 'Ajouter une langue';
    addCompetitorBtn.innerHTML = `<span class="icon" aria-hidden="true">+</span><span class="text-label">${buttonText}</span>`;
    addCompetitorBtn.addEventListener('click', () => {
        addVersusSelector(true);
        displayVersusComparison();
    });
    controlsContainer.appendChild(addCompetitorBtn);
    displayVersusComparison();
}
function updateAddCompetitorButton() {
    const availableLangs = [...new Set(sujetsDataGlobal.map(p => p.language || 'fr'))];
    const selectorCount = document.querySelectorAll('#versus-controls .lang-selector-wrapper').length;
    
    if (addCompetitorBtn) {
        const canAddMore = selectorCount < availableLangs.length && selectorCount < 5;
        addCompetitorBtn.style.display = canAddMore ? 'inline-flex' : 'none';
    }
}
function addVersusSelector(canBeRemoved, defaultValue = '') {
    if (versusControls.children.length > 0) {
        const vsSeparator = document.createElement('div');
        vsSeparator.className = 'versus-separator-dynamic';
        vsSeparator.textContent = 'VS';
        versusControls.appendChild(vsSeparator);
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'lang-selector-wrapper custom-versus-dropdown';
    const label = document.createElement('label');
    wrapper.appendChild(label);
    const inputGroup = document.createElement('div');
    inputGroup.className = 'lang-selector-input-group';
    wrapper.appendChild(inputGroup);
    const selectComponent = createVersusSelect(defaultValue);
    inputGroup.appendChild(selectComponent);
    
    if (canBeRemoved) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove-competitor-inline';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            wrapper.previousElementSibling?.remove();
            wrapper.remove();
            displayVersusComparison();
        };
        inputGroup.appendChild(removeBtn);
    }
    
    versusControls.appendChild(wrapper);
}
function createVersusSelect(defaultValue) {
    const select = document.createElement('select');
    select.className = 'versus-lang-select';
    select.style.display = 'none';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'esport-select custom-select-toggle';
    toggle.innerHTML = `<img src="" class="flag-icon" style="display: none;"> <span class="text-label"></span> <span class="arrow-icon">▼</span>`;
    const menuList = document.createElement('ul');
    menuList.className = 'custom-select-menu';
    menuList.style.display = 'none';
    const availableLangs = [...new Set(sujetsDataGlobal.map(p => p.language || 'fr'))].sort();
    const usedLangs = Array.from(document.querySelectorAll('.versus-lang-select')).map(s => s.value);
    
    availableLangs.forEach(langCode => {
        const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langCode)?.textContent || langCode;
        select.innerHTML += `<option value="${langCode}">${langName}</option>`;
        
        const listItem = document.createElement('li');
        listItem.dataset.value = langCode;
        listItem.innerHTML = `<img src="${languageFlags[langCode] || ''}" class="flag-icon"> ${langName}`;
        listItem.addEventListener('click', () => {
            select.value = langCode;
            updateVersusDropdownDisplay(toggle, langCode);
            menuList.style.display = 'none';
            toggle.classList.remove('open');
            displayVersusComparison();
        });
        menuList.appendChild(listItem);
    });
    if (defaultValue && availableLangs.includes(defaultValue)) {
        select.value = defaultValue;
    } else {
        const unusedLang = availableLangs.find(l => !usedLangs.includes(l));
        if (unusedLang) select.value = unusedLang;
    }
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuList.style.display === 'block';
        document.querySelectorAll('.custom-select-menu').forEach(menu => menu.style.display = 'none');
        document.querySelectorAll('.custom-select-toggle').forEach(t => t.classList.remove('open'));
        if (!isOpen) {
            menuList.style.display = 'block';
            toggle.classList.add('open');
        }
    });
    updateVersusDropdownDisplay(toggle, select.value);
    const fragment = document.createDocumentFragment();
    fragment.appendChild(toggle);
    fragment.appendChild(menuList);
    fragment.appendChild(select);
    return fragment;
}
function updateVersusDropdownDisplay(button, langCode) {
    const flagImg = button.querySelector('img.flag-icon');
    const textSpan = button.querySelector('span.text-label');
    const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langCode)?.textContent || langCode;
    if (langCode && langName) {
        textSpan.textContent = langName;
        flagImg.src = languageFlags[langCode] || '';
        flagImg.style.display = 'inline-block';
    } else {
        textSpan.textContent = `-- ${translations[currentLang]?.selectCategoryPrompt || 'Select'} --`;
        flagImg.style.display = 'none';
    }
}
function displayVersusComparison() {
    const selects = document.querySelectorAll('.versus-lang-select');
    const selectedLangs = Array.from(selects).map(s => s.value).filter(lang => lang);
    const hasDuplicates = new Set(selectedLangs).size !== selectedLangs.length;
    
    updateAllVersusLabels();
    updateAddCompetitorButton();
    let detailsContainer = document.querySelector('.versus-comparison-details');
    if (detailsContainer) detailsContainer.remove();
    versusResultsContainer.innerHTML = '';
    if (selectedLangs.length < 2) {
        versusResultsContainer.innerHTML = `<div class="versus-placeholder">${translations[currentLang]?.langStatsDefaultMessage || 'Select at least two languages to compare.'}</div>`;
        return;
    }
    if (hasDuplicates) {
        versusResultsContainer.innerHTML = `<div class="versus-placeholder">${(translations[currentLang]?.langStatsDefaultMessage || 'Please select different languages.').replace('deux langues', 'des langues différentes')}</div>`;
        return;
    }
    const allStats = selectedLangs.map(langCode => {
        const selectEl = Array.from(selects).find(s => s.value === langCode);
        const name = selectEl.querySelector(`option[value="${langCode}"]`).textContent || langCode;
        return { ...getLanguageStats(langCode), code: langCode, name: name };
    });
    let htmlCards = '';
    allStats.forEach((stats, index) => {
        const opponentStats = allStats.length === 2 ? allStats[1 - index] : null;
        htmlCards += renderLangStatCard(stats.code, stats.name, stats, opponentStats);
    });
    versusResultsContainer.innerHTML = htmlCards;
    detailsContainer = document.createElement('div');
    detailsContainer.className = 'versus-comparison-details';
    versusResultsContainer.insertAdjacentElement('afterend', detailsContainer);
    if (selectedLangs.length >= 3) {
        renderMultiLangComparisonChart(allStats);
    } else if (selectedLangs.length === 2) {
        const [lang1, lang2] = allStats;
        const sujets1 = sujetsDataGlobal.filter(p => (p.language || 'fr') === lang1.code);
        const sujets2 = sujetsDataGlobal.filter(p => (p.language || 'fr') === lang2.code);
        const map1 = new Map(sujets1.map(p => [p.Key, p]));
        const map2 = new Map(sujets2.map(p => [p.Key, p]));
        const diff = { uniqueToA: [], uniqueToB: [], common: [] };
        map1.forEach((p, id) => map2.has(id) ? diff.common.push(p) : diff.uniqueToA.push(p));
        map2.forEach((p, id) => { if (!map1.has(id)) diff.uniqueToB.push(p) });
        detailsContainer.innerHTML = renderComparisonDetails(diff, lang1, lang2);
        const translateBtnForLang1 = document.getElementById('translate-missing-for-B');
        if (translateBtnForLang1) translateBtnForLang1.addEventListener('click', () => translateMissingSujets(lang1.code, lang2.code, diff.uniqueToB));
        const translateBtnForLang2 = document.getElementById('translate-missing-for-A');
        if (translateBtnForLang2) translateBtnForLang2.addEventListener('click', () => translateMissingSujets(lang2.code, lang1.code, diff.uniqueToA));
    }
}
function renderMultiLangComparisonChart(stats) {
    const chartTitle = translations[currentLang].multiLangChartTitle || 'Comparaison des Statistiques';
    const existingDetails = document.querySelector('.versus-comparison-details');
    if (existingDetails) {
        existingDetails.remove();
    }
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'versus-comparison-details';
    versusResultsContainer.insertAdjacentElement('afterend', detailsContainer);
    detailsContainer.innerHTML = `<h3>${chartTitle}</h3><div class="multi-lang-chart-container"><canvas id="multiLangBarChart"></canvas></div>`;
    setTimeout(() => {
        const canvas = document.getElementById('multiLangBarChart');
        if (!canvas) return;
        const chartTextColor = 'rgba(255, 255, 255, 0.9)';
        const chartGridColor = 'rgba(255, 255, 255, 0.1)';
        const tooltipBgColor = 'rgba(0,0,0,0.8)';
        const tooltipTitleColor = '#fff';
        const tooltipBodyColor = '#fff';
        const tooltipBorderColor = 'rgba(253, 216, 53, 0.5)';
        
        const data = {
            labels: stats.map(s => s.name),
            datasets: [
                {
                    label: translations[currentLang].langStatsTotalSubjects || 'Sujets Totaux',
                    data: stats.map(s => s.totalSujets),
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    yAxisID: 'y-subjects',
                },
                {
                    label: translations[currentLang].langStatsWithAge || 'Sujets avec Âge',
                    data: stats.map(s => s.sujetsWithAge),
                    backgroundColor: 'rgba(243, 156, 18, 0.8)',
                    borderColor: 'rgba(243, 156, 18, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    yAxisID: 'y-others',
                },
                {
                    label: translations[currentLang].langStatsCategories || 'Catégories',
                    data: stats.map(s => s.totalCategories),
                    backgroundColor: 'rgba(46, 204, 113, 0.8)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    yAxisID: 'y-others',
                }
            ]
        };
        const originalColors = data.datasets.map(ds => {
            return Array(data.labels.length).fill(ds.backgroundColor);
        });
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            onHover: (event, elements) => {
                const chart = event.chart;
                chart.canvas.style.cursor = 'default';
                if (elements.length > 0) {
                    chart.canvas.style.cursor = 'pointer';
                    const hoveredIndex = elements[0].index;
                    
                    chart.data.datasets.forEach((dataset, i) => {
                        dataset.backgroundColor = originalColors[i].map((color, index) => {
                            return index === hoveredIndex ? color : Chart.helpers.color(color).alpha(0.2).rgbString();
                        });
                    });
                } else {
                    chart.data.datasets.forEach((dataset, i) => {
                        dataset.backgroundColor = originalColors[i];
                    });
                }
                
                chart.update('none');
            },
            scales: {
                x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                'y-subjects': {
                    type: 'linear', position: 'left',
                    title: { display: true, text: translations[currentLang].chartAxisSubjects || 'Nombre de Sujets', color: chartTextColor },
                    ticks: { color: chartTextColor }, grid: { color: chartGridColor }
                },
                'y-others': {
                    type: 'linear', position: 'right',
                    title: { display: true, text: translations[currentLang].chartAxisOthers || 'Nombre (Catégories / Âge)', color: chartTextColor },
                    ticks: { color: chartTextColor }, grid: { drawOnChartArea: false }
                }
            },
            plugins: {
                datalabels: { display: false },
                legend: { labels: { color: chartTextColor } },
                tooltip: { backgroundColor: tooltipBgColor, titleColor: tooltipTitleColor, bodyColor: tooltipBodyColor, borderColor: tooltipBorderColor, borderWidth: 1, padding: 12, cornerRadius: 6, boxPadding: 4, }
            }
        };
        new Chart(canvas, { type: 'bar', data: data, options: options });
    }, 50);
}
function getLanguageStats(langCode) {
    const sujets = sujetsDataGlobal.filter(p => (p.language || 'fr') === langCode);
    const totalSujets = sujets.length;
    const categories = new Set(sujets.map(p => p.category).filter(Boolean));
    const totalCategories = categories.size;
    const sujetsWithAge = sujets.filter(p => p.minrecommandedAge !== undefined || p.maxrecommandedAge !== undefined).length;
    const sujetsFR = sujetsDataGlobal.filter(p => p.language === 'fr' || !p.language);
    const totalCanonical = new Set(sujetsFR.map(p => p.Key)).size;
    let completion = 0;
    if (langCode === 'fr') {
        completion = totalSujets > 0 ? 100 : 0;
    } else {
        completion = totalCanonical > 0 ? (totalSujets / totalCanonical) * 100 : 0;
    }
    const categoryDetails = {};
    categories.forEach(cat => {
        const sujetsInCat = sujets.filter(p => p.category === cat);
        const sujetsInCatWithAge = sujetsInCat.filter(p => p.minrecommandedAge !== undefined || p.maxrecommandedAge !== undefined).length;
        categoryDetails[cat] = { total: sujetsInCat.length, withAge: sujetsInCatWithAge, };
    });
    return { totalSujets, totalCategories, sujetsWithAge, completion, categoryDetails, totalCanonical };
}
function renderLangStatCard(langCode, langName, stats, opponentStats) {
    const flagUrl = languageFlags[langCode] || '';
    const completionFormatted = stats.completion.toFixed(stats.completion > 0 && stats.completion < 1 ? 1 : 0);
    let diffTextHtml = '';
    if (opponentStats) {
        const sujetDifference = stats.totalSujets - opponentStats.totalSujets;
        if (sujetDifference === 0) {
            diffTextHtml = `<div class="lang-stat-line-extra"><strong>${translations[currentLang].statSubjectsDifference || 'Différence'}:</strong> <span class="diff-synced">${translations[currentLang].perfectSync || 'Synchro Parfaite'}</span></div>`;
        } else if (sujetDifference > 0) {
            diffTextHtml = `<div class="lang-stat-line-extra"><strong>${translations[currentLang].statSubjectsDifference || 'Différence'}:</strong> <span class="diff-positive">+${sujetDifference} ${translations[currentLang].subjectsMore || 'sujets'}</span></div>`;
        } else {
            diffTextHtml = `<div class="lang-stat-line-extra"><strong>${translations[currentLang].statSubjectsDifference || 'Différence'}:</strong> <span class="diff-negative">${sujetDifference} ${translations[currentLang].subjectsLess || 'sujets'}</span></div>`;
        }
    }
    let detailsHtml = '';
    const sortedCategories = Object.keys(stats.categoryDetails).sort((a,b) => getTranslatedCategoryName(a, currentLang).localeCompare(getTranslatedCategoryName(b, currentLang)));
    sortedCategories.forEach(catKey => {
        const catData = stats.categoryDetails[catKey];
        detailsHtml += `<tr><td>${getTranslatedCategoryName(catKey, currentLang)}</td><td>${catData.total}</td><td>${((catData.withAge / catData.total || 0) * 100).toFixed(0)}%</td></tr>`;
    });
    return `
        <div class="lang-stat-card">
            <div class="lang-stat-card-header">
                ${flagUrl ? `<img src="${flagUrl}" alt="Drapeau ${langName}" class="flag-icon">` : ''}
                <h5>${langName}</h5>
            </div>
            <div class="lang-stat-line"><strong>${translations[currentLang].langStatsTotalSubjects || 'Sujets Totaux'}:</strong> ${stats.totalSujets}</div>
            <div class="lang-stat-line"><strong>${translations[currentLang].langStatsCategories || 'Catégories'}:</strong> ${stats.totalCategories}</div>
            <div class="lang-stat-line"><strong>${translations[currentLang].langStatsWithAge || 'Avec Âge'}:</strong> ${stats.sujetsWithAge} (${(stats.totalSujets > 0 ? (stats.sujetsWithAge / stats.totalSujets) * 100 : 0).toFixed(0)}%)</div>
            ${diffTextHtml}
            <div>
                <div class="lang-stat-line"><strong>${translations[currentLang].statCardCompletion || 'Complétion'}:</strong></div>
                <div class="lang-progress-bar-container" title="${completionFormatted}% complété">
                    <div class="lang-progress-bar" style="width: ${stats.completion}%;">${completionFormatted}%</div>
                </div>
            </div>
            ${detailsHtml ? `
            <details>
                <summary>${translations[currentLang].statCardDetails || 'Détails par catégorie'}</summary>
                <div class="category-details-table-container">
                    <table class="category-details-table">
                        <thead><tr><th>${translations[currentLang].labelCategory || 'Catégorie'}</th><th>${translations[currentLang].totalLabel || 'Total'}</th><th>% ${translations[currentLang].ageLabel || 'Âge'}</th></tr></thead>
                        <tbody>${detailsHtml}</tbody>
                    </table>
                </div>
            </details>` : ''}
        </div>`;
}
function renderComparisonDetails(diffData, langA, langB) {
    if (diffData.uniqueToA.length === 0 && diffData.uniqueToB.length === 0) {
         return `
            <h3>${translations[currentLang].comparisonTitle || 'Détails de la Comparaison'}</h3>
            <div class="all-synced-message">
                <span class="icon">✅</span>
                <span>${translations[currentLang].allSubjectsMatch || 'Tous les sujets sont synchronisés !'}</span>
            </div>
            ${renderList(diffData.common, (translations[currentLang].comparisonCommon || 'Sujets Communs'), 'common')}`;
    }
    return `
        <h3>${translations[currentLang].comparisonTitle || 'Détails de la Comparaison'}</h3>
        <div class="comparison-lists-grid">
            ${renderList(diffData.uniqueToB, (translations[currentLang].subjectsMissingIn || 'Manquants dans {lang}').replace('{lang}', `<strong>${langA.name}</strong>`), 'B', langB.code, langA.code)}
            ${renderList(diffData.common, (translations[currentLang].comparisonCommon || 'Sujets Communs'), 'common')}
            ${renderList(diffData.uniqueToA, (translations[currentLang].subjectsMissingIn || 'Manquants dans {lang}').replace('{lang}', `<strong>${langB.name}</strong>`), 'A', langA.code, langB.code)}
        </div>`;
}
function renderList(sujets, title, type, sourceLang, targetLang) {
    let actionButtons = '';
    if (type !== 'common' && sujets.length > 0) {
        actionButtons = `
            <div class="list-actions">
                <button id="translate-missing-for-${type}" class="btn-in-list-action btn-translate-missing">
                    <span class="icon">🌐</span> ${translations[currentLang].translateMissingButton || 'Traduire les manquants'}
                </button>
            </div>`;
    }
    let listHtml = `<div class="versus-column list-type-${type}"><h4>${title} (${sujets.length})</h4>${actionButtons}<div class="list-wrapper">`;
    const groupedByCat = sujets.reduce((acc, p) => {
        const catName = getTranslatedCategoryName(p.category, currentLang);
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(p.name);
        return acc;
    }, {});
    const sortedCats = Object.keys(groupedByCat).sort((a, b) => a.localeCompare(b, currentLang));
    if (sortedCats.length === 0) {
        listHtml += '<ul><li class="no-items">-</li></ul>';
    } else {
        sortedCats.forEach(catName => {
            listHtml += `<h5>${catName}</h5><ul>`;
            groupedByCat[catName].sort((a,b) => a.localeCompare(b, currentLang)).forEach(name => {
                listHtml += `<li>${name}</li>`;
            });
            listHtml += '</ul>';
        });
    }
    listHtml += '</div></div>';
    return listHtml;
}
async function translateMissingSujets(targetLang, sourceLang, sujetsToTranslate) {
    if (sujetsToTranslate.length === 0) {
        showToast("Il n'y a rien à traduire !", 'info');
        return;
    }
    const buttonId = `translate-missing-for-${sourceLang === document.querySelectorAll('.versus-lang-select')[0].value ? 'A' : 'B'}`;
    const translateBtn = document.getElementById(buttonId);
    if (translateBtn) translateBtn.disabled = true;
    showTranslationProgress(sujetsToTranslate.length);
    isTranslationCancelled = false;
    let localNewlyTranslatedSujets = [];
    let successCount = 0, failCount = 0, itemsProcessed = 0;
    for (let i = 0; i < sujetsToTranslate.length; i += CONCURRENT_TRANSLATIONS_LIMIT) {
        if (isTranslationCancelled) break;
        const batch = sujetsToTranslate.slice(i, i + CONCURRENT_TRANSLATIONS_LIMIT);
        const promises = batch.map(async (sujet) => {
            const newSujet = await translateSingleSujet(sujet, targetLang, sourceLang);
            if (newSujet) {
                localNewlyTranslatedSujets.push(newSujet);
                return true;
            }
            return false;
        });
        const results = await Promise.all(promises);
        results.forEach(success => {
            if (success) successCount++;
            else failCount++;
            itemsProcessed++;
            if (!isTranslationCancelled) updateTranslationProgress(itemsProcessed, sujetsToTranslate.length);
        });
        if (!isTranslationCancelled) await new Promise(resolve => setTimeout(resolve, 250));
    }
    hideTranslationProgress();
    if (translateBtn) translateBtn.disabled = false;
    if (!isTranslationCancelled) {
        const summaryMsgKey = 'translationBatchSummary';
        const summary = (translations[currentLang][summaryMsgKey] || "")
            .replace('{success}', successCount)
            .replace('{fail}', translations[currentLang]?.labelSuccessSuffix || 'réussie(s)')
            .replace('{fail}', failCount)
            .replace('{labelFail}', translations[currentLang]?.labelFailSuffix || 'échec(s)');
        showToast(summary, failCount > 0 ? 'error' : 'success', 5000);
        if (successCount > 0) {
            const categoriesToInclude = [...new Set(localNewlyTranslatedSujets.map(p => p.category).filter(Boolean))];
            const fileName = `traductions_manquantes_pour_${targetLang}.json`;
            _downloadJSON(localNewlyTranslatedSujets, categoriesToInclude, fileName, false);
        }
    }
}
function displayGlobalView() {
    displayGlobalKpis();
    displayGlobalMapView();
    displayTopLanguagesChart();
}
function displayGlobalKpis() {
    const kpiGrid = document.getElementById('global-stats-kpi-grid');
    kpiGrid.innerHTML = '<div class="loader"></div>';
    const langCounts = {};
    let totalSujets = 0;
    sujetsDataGlobal.forEach(p => {
        const lang = p.language || 'fr';
        langCounts[lang] = (langCounts[lang] || 0) + 1;
        totalSujets++;
    });
    const sortedLangs = Object.entries(langCounts).sort(([, a], [, b]) => b - a);
    const kpiData = {
        totalLangs: sortedLangs.length,
        totalSujets: totalSujets,
        topLang: sortedLangs.length > 0 ? (Array.from(languageFilterSelect.options).find(opt => opt.value === sortedLangs[0][0])?.textContent || sortedLangs[0][0]) : '-',
        worstLang: sortedLangs.length > 1 ? (Array.from(languageFilterSelect.options).find(opt => opt.value === sortedLangs[sortedLangs.length - 1][0])?.textContent || sortedLangs[sortedLangs.length-1][0]) : '-'
    };
    kpiGrid.innerHTML = `
        <div class="kpi-card" style="animation-delay: 0s;">
            <div class="kpi-card-title">${translations[currentLang].kpiTotalLangs}</div>
            <div class="kpi-card-value" data-kpi-value="${kpiData.totalLangs}">0</div>
        </div>
        <div class="kpi-card" style="animation-delay: 0.1s;">
            <div class="kpi-card-title">${translations[currentLang].kpiTotalSujets}</div>
            <div class="kpi-card-value" data-kpi-value="${kpiData.totalSujets}">0</div>
        </div>
        <div class="kpi-card" style="animation-delay: 0.2s;">
            <div class="kpi-card-title">${translations[currentLang].kpiTopLang}</div>
            <div class="kpi-card-value">${kpiData.topLang}</div>
        </div>
        <div class="kpi-card" style="animation-delay: 0.3s;">
            <div class="kpi-card-title">${translations[currentLang].kpiWorstLang}</div>
            <div class="kpi-card-value">${kpiData.worstLang}</div>
        </div>`;
    kpiGrid.querySelectorAll('[data-kpi-value]').forEach(el => {
        const target = parseInt(el.dataset.kpiValue, 10);
        if (!isNaN(target)) {
            animateCounter(el, target, null);
        }
    });
}
function displayTopLanguagesChart() {
    const container = document.getElementById('global-stats-chart-container').querySelector('.canvas-container');
    container.innerHTML = '<div class="loader"></div>';
    const langCounts = {};
    sujetsDataGlobal.forEach(p => {
        const lang = p.language || 'fr';
        langCounts[lang] = (langCounts[lang] || 0) + 1;
    });
    const sortedLangs = Object.entries(langCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
    if (topLanguagesChartInstance) {
        topLanguagesChartInstance.destroy();
    }
    setTimeout(() => {
        container.innerHTML = '';
        if(sortedLangs.length === 0) {
            container.innerHTML = `<p class="message">${translations[currentLang]?.errorLoadingCharts || "Data unavailable."}</p>`;
            return;
        }
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        topLanguagesChartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: sortedLangs.map(([lang]) => Array.from(languageFilterSelect.options).find(opt => opt.value === lang)?.textContent || lang),
                datasets: [{
                    label: translations[currentLang].sujetsSuffix || 'Topics',
                    data: sortedLangs.map(([, count]) => count),
                    backgroundColor: 'rgba(253, 216, 53, 0.7)',
                    borderColor: 'rgba(253, 216, 53, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000, easing: 'easeOutQuart' },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { color: 'rgba(255,255,255,0.7)' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        ticks: { color: 'rgba(255,255,255,0.9)' },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#fff', }
                }
            }
        });
    }, 200);
}
function displayGlobalMapView() {
    const mapContainer = document.getElementById('world-map-container');
    if (!mapContainer) return;
    mapContainer.innerHTML = `<div class="loader"></div>`;
    const langCounts = {};
    sujetsDataGlobal.forEach(p => {
        const lang = p.language || 'fr';
        langCounts[lang] = (langCounts[lang] || 0) + 1;
    });
    const countriesWithData = Object.keys(langCounts)
        .map(lang => ({ name: langToCountry[lang], value: langCounts[lang], langCode: lang, }))
        .filter(d => d.name && d.value > 0);
    const values = countriesWithData.map(c => c.value);
    const maxVal = Math.max(...values, 1);
    const scaleMax = Math.ceil(maxVal / 1000) * 1000;
    fetch('https://unpkg.com/world-atlas/countries-50m.json')
        .then((r) => r.json())
        .then((world) => {
            const currentMapContainer = document.getElementById('world-map-container');
            if (!currentMapContainer) return;
            currentMapContainer.innerHTML = '';
            const canvas = document.createElement('canvas');
            currentMapContainer.appendChild(canvas);
            const countries = ChartGeo.topojson.feature(world, world.objects.countries).features;
            if (worldMapChartInstance) {
                worldMapChartInstance.destroy();
            }
            worldMapChartInstance = new Chart(canvas.getContext("2d"), {
                type: 'choropleth',
                data: {
                    labels: countries.map((d) => d.properties.name),
                    datasets: [{
                        label: 'Sujets par pays',
                        outline: countries,
                        data: countries.map((d) => {
                            const countryData = countriesWithData.find(c => c.name === d.properties.name);
                            return { feature: d, value: countryData ? countryData.value : 0, langCode: countryData ? countryData.langCode : null };
                        }),
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    onHover: (event, chartElements) => {
                        const canvasEl = event.native?.target;
                        if(canvasEl) {
                           const hasData = chartElements.length > 0 && chartElements[0].element.value > 0;
                           canvasEl.style.cursor = hasData ? 'pointer' : 'default';
                        }
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const clickedElement = elements[0];
                            const dataPoint = clickedElement.element.$context.raw;
                            if (dataPoint && dataPoint.value > 0 && dataPoint.langCode) {
                                closeLangHubModal();
                                languageFilterSelect.value = dataPoint.langCode;
                                languageFilterSelect.dispatchEvent(new Event('change'));
                                setTimeout(() => {
                                    document.getElementById('sujets-grid').scrollIntoView({ behavior: 'smooth', block: 'start'});
                                }, 350);
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            display: false
                        },
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const dataPoint = context.dataset.data[context.dataIndex];
                                    if (dataPoint && dataPoint.value > 0) {
                                        const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === dataPoint.langCode)?.textContent || dataPoint.langCode;
                                        const hoverText = translations[currentLang]?.worldMapHover || '{lang}: {count} topics';
                                        return hoverText.replace('{lang}', langName).replace('{count}', dataPoint.value);
                                    }
                                    return null;
                                }
                            }
                        }
                    },
                    scales: {
                        projection: { axis: 'x', projection: 'equalEarth' },
                        color: {
                            axis: 'x',
                            min: 0,
                            max: scaleMax,
                            interpolate: (v) => {
                                if (v <= 0) return 'rgba(236, 240, 241, 0.7)';
                                const startColor = { r: 255, g: 235, b: 238 };
                                const endColor = { r: 231, g: 76, b: 60 };
                                const r = Math.round(startColor.r + v * (endColor.r - startColor.r));
                                const g = Math.round(startColor.g + v * (endColor.g - startColor.g));
                                const b = Math.round(startColor.b + v * (endColor.b - startColor.b));
                                return `rgb(${r}, ${g}, ${b})`;
                            },
                            legend: {
                                display: true,
                                position: 'bottom-right',
                                align: 'bottom',
                                indicatorWidth: 15,
                                margin: 10,
                                ticks: { stepSize: 1000, color: 'rgba(255, 255, 255, 0.9)', font: { size: 10, weight: 'bold' } }
                            }
                        }
                    },
                    elements: {
                        geoFeature: { hoverBackgroundColor: 'rgba(253, 216, 53, 0.8)', borderColor: 'rgba(44, 62, 80, 0.4)', borderWidth: 0.5, },
                        outline: { borderColor: 'blue', borderWidth: 2, },
                        graticule: { borderColor: 'rgba(127, 140, 141, 0.3)', borderWidth: 0.5 }
                    }
                },
                plugins: [{
                    id: 'oceanBackground',
                    beforeDraw(chart) {
                        const {ctx, chartArea: {top, bottom, left, right, width, height}} = chart;
                        ctx.save();
                        ctx.fillStyle = '#AADAFF';
                        ctx.fillRect(left, top, width, height);
                        ctx.restore();
                    }
                }]
            });
        }).catch(err => {
            console.error("Failed to load map data:", err);
            const currentMapContainer = document.getElementById('world-map-container');
            if (currentMapContainer) currentMapContainer.innerHTML = `<p class="message">${translations[currentLang]?.errorLoadingCharts || 'Error loading chart'}</p>`;
        });
}
function setupAdvancedStatsControls() {
    const availableLangs = [...new Set(sujetsDataGlobal.map(p => p.language || 'fr'))];
    
    const currentVal = advStatsLangFilter.value;
    advStatsLangFilter.innerHTML = '';
    availableLangs.forEach(langCode => {
        const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langCode)?.textContent || langCode;
        const optionEl = document.createElement('option');
        optionEl.value = langCode;
        optionEl.textContent = langName;
        advStatsLangFilter.appendChild(optionEl);
    });
    if (currentVal && availableLangs.includes(currentVal)) {
        advStatsLangFilter.value = currentVal;
    } else if (availableLangs.length > 0) {
        advStatsLangFilter.value = availableLangs[0];
    }
    initCustomAdvStatsLangDropdown();
    advStatsSortFilter.querySelectorAll('option').forEach(opt => {
        const key = opt.dataset.translateKey;
        if (key) {
            opt.textContent = translations[currentLang][key] || opt.textContent;
        }
    });
}
function initCustomAdvStatsLangDropdown() {
    if (!advStatsLangToggle || !advStatsLangMenuList || !advStatsLangFilter) return;
    const updateDisplay = (langCode) => {
        const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langCode)?.textContent || langCode;
        const flagUrl = languageFlags[langCode] || '';
        const textLabel = advStatsLangToggle.querySelector('.text-label');
        const flagIcon = advStatsLangToggle.querySelector('.flag-icon');
        if (textLabel) textLabel.textContent = langName;
        if (flagIcon) {
            flagIcon.src = flagUrl;
            flagIcon.style.display = flagUrl ? 'inline-block' : 'none';
        }
    };
    const availableLangs = [...new Set(sujetsDataGlobal.map(p => p.language || 'fr'))].sort();
    advStatsLangMenuList.innerHTML = '';
    availableLangs.forEach(langCode => {
        const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === langCode)?.textContent || langCode;
        const flagUrl = languageFlags[langCode] || '';
        const li = document.createElement('li');
        li.dataset.value = langCode;
        li.innerHTML = `<img src="${flagUrl}" class="flag-icon" style="width:20px; height:15px; border-radius:2px;"> ${langName}`;
        
        li.addEventListener('click', () => {
            advStatsLangFilter.value = langCode;
            updateDisplay(langCode);
            advStatsLangMenuList.style.display = 'none';
            advStatsLangToggle.classList.remove('open');
            displayAdvancedStats();
        });
        advStatsLangMenuList.appendChild(li);
    });
    advStatsLangToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = advStatsLangMenuList.style.display === 'block';
        document.querySelectorAll('.custom-select-menu').forEach(menu => menu.style.display = 'none');
        document.querySelectorAll('.custom-select-toggle').forEach(t => t.classList.remove('open'));
        if (!isOpen) {
            advStatsLangMenuList.style.display = 'block';
            advStatsLangToggle.classList.add('open');
        }
    });
    updateDisplay(advStatsLangFilter.value);
}
function displayAdvancedStats() {
    advancedStatsTableContainer.innerHTML = '<div class="loader"></div>';
    const selectedLang = advStatsLangFilter.value || (advStatsLangFilter.options[0] ? advStatsLangFilter.options[0].value : null);
    if (!selectedLang) {
        advancedStatsTableContainer.innerHTML = '';
        return;
    }
    const sortBy = advStatsSortFilter.value;
    let data = getAllCategoryStatsForLang(selectedLang);
    data.sort((a, b) => {
        switch(sortBy) {
            case 'total-asc': return a.total - b.total;
            case 'total-desc': return b.total - a.total;
            case 'name-desc': return b.name.localeCompare(a.name, currentLang);
            case 'age-desc': return (b.withAge / (b.total || 1)) - (a.withAge / (a.total || 1));
            case 'name-asc': default: return a.name.localeCompare(a.name, currentLang);
        }
    });
    let tableHtml = `
        <table class="advanced-stats-table">
            <thead>
                <tr>
                    <th>${translations[currentLang]?.labelCategory || 'Catégorie'}</th>
                    <th>${translations[currentLang]?.totalLabel || 'Total'}</th>
                    <th>${translations[currentLang]?.langStatsWithAge || 'Avec Âge'}</th>
                    <th>${translations[currentLang]?.statsAgeDistribution || 'Répartition par Âge'}</th>
                </tr>
            </thead>
            <tbody>`;
    data.forEach(cat => {
        const agePercent = cat.total > 0 ? ((cat.withAge / cat.total) * 100).toFixed(0) : 0;
        let ageDetailsHtml = '<div class="age-distribution-container">';
        const possibleAges = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let hasAgeData = false;
        possibleAges.forEach(age => {
            const count = cat.ageDistribution[age];
            if (count > 0) {
                hasAgeData = true;
                const color = ageColors[age] || defaultAgeColor;
                const textColor = isColorDark(color) ? '#FFFFFF' : '#111111';
                ageDetailsHtml += `<button class="age-pill"
                                           style="background-color: ${color}; color: ${textColor};"
                                           onclick="openAgeDetailsChartModal(${age})"
                                           aria-label="Voir détails pour l'âge de ${age} ans">
                                       ${age}<span class="age-pill-suffix">a</span>
                                   </button>`;
            }
        });
        if (!hasAgeData) {
            ageDetailsHtml += '<span class="no-age-data-pill">-</span>';
        }
        ageDetailsHtml += '</div>';
        const icon = categoryIcons[cat.key] || defaultCategoryIcon;
        tableHtml += `
            <tr>
                <td><span class="icon" aria-hidden="true">${icon}</span> ${cat.name}</td>
                <td style="text-align:center;">${cat.total}</td>
                <td style="text-align:center;">${cat.withAge} (${agePercent}%)</td>
                <td>${ageDetailsHtml}</td>
            </tr>`;
    });
    tableHtml += '</tbody></table>';
    setTimeout(() => {
        advancedStatsTableContainer.innerHTML = tableHtml;
    }, 200);
}
function openAgeDetailsChartModal(age) {
    const selectedLang = advStatsLangFilter.value;
    if (!selectedLang) return;
    const sujetsInLang = sujetsDataGlobal.filter(p => (p.language || 'fr') === selectedLang);
    const sujetsForAge = sujetsInLang.filter(p => {
        const minAge = p.minrecommandedAge || 3;
        const maxAge = p.maxrecommandedAge || 12;
        return (p.minrecommandedAge !== undefined || p.maxrecommandedAge !== undefined) && age >= minAge && age <= maxAge;
    });
    const categoryData = sujetsForAge.reduce((acc, p) => {
        const catName = getTranslatedCategoryName(p.category, selectedLang);
        if (!acc[catName]) {
            acc[catName] = { count: 0, names: [] };
        }
        acc[catName].count++;
        acc[catName].names.push(p.name);
        return acc;
    }, {});
    const sortedCategories = Object.entries(categoryData).sort(([, a], [, b]) => b.count - a.count);
    const langName = Array.from(languageFilterSelect.options).find(o => o.value === selectedLang)?.textContent || selectedLang;
    const yearsSuffix = translations[currentLang]?.yearsSuffix || 'ans';
    ageDetailsModalTitle.textContent = `${translations[currentLang]?.statsAgeDistribution || 'Répartition'} pour ${age} ${yearsSuffix} (${langName})`;
    generateAgeDetailsChart(sortedCategories);
    ageDetailsChartModal.classList.add('open');
    ageDetailsChartModal.style.display = 'flex';
}
function closeAgeDetailsChartModal() {
    ageDetailsChartModal.classList.remove('open');
    setTimeout(() => {
        ageDetailsChartModal.style.display = 'none';
        if (ageDetailChartInstance) {
            ageDetailChartInstance.destroy();
            ageDetailChartInstance = null;
        }
    }, 300);
}
function generateAgeDetailsChart(chartData) {
    if (ageDetailChartInstance) {
        ageDetailChartInstance.destroy();
    }
    const canvas = document.getElementById('age-details-chart-canvas');
    if (!canvas) return;
    const labels = chartData.map(item => item[0]);
    const data = chartData.map(item => item[1].count);
    const sujetNames = chartData.map(item => item[1].names);
    fallbackColorIndex = 0;
    blackUsageCount = 0;
    const categoryKeys = labels.map(label => {
        const currentLangCats = translations[currentLang]?.categoryNames || {};
        return Object.keys(currentLangCats).find(key => currentLangCats[key] === label) ||
               Object.keys(translations.fr.categoryNames).find(key => translations.fr.categoryNames[key] === label) ||
               'unclassified';
    });
    const backgroundColors = categoryKeys.map(key => getCategoryColor(key));
    const borderColors = backgroundColors.map(color => isColorDark(color) ? '#4b5563' : '#FFFFFF');
    ageDetailChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: 'Sujets',
            data: data,
            sujetNames: sujetNames,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { animateScale: true, animateRotate: true },
        onHover: (event, chartElement) => {
            const chart = event.chart;
            chart.data.datasets[0].backgroundColor = [...backgroundColors];
            if (chartElement.length > 0) {
                const hoveredIndex = chartElement[0].index;
                chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
                    if (index !== hoveredIndex) {
                        colors[index] = Chart.helpers.color(color).alpha(0.2).rgbString();
                    }
                });
            }
            chart.update();
        },
        plugins: {
            datalabels: {
                display: false
            },
            legend: {
                position: 'right',
                labels: { color: '#ecf0f1', boxWidth: 15, padding: 20, font: { size: 12 } }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.85)',
                titleColor: '#fff',
                bodyColor: '#fff',
                footerColor: '#ccc',
                padding: 10,
                callbacks: {
                    title: function(context) { return context[0].label; },
                    label: function(context) {
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) + '%' : '0%';
                        const sujetSuffix = context.raw > 1 ? (translations[currentLang]?.sujetsSuffix || 'topics') : (translations[currentLang]?.sujetSuffix || 'topic');
                        return `${context.raw} ${sujetSuffix} (${percentage})`;
                    },
                    afterBody: function(context) {
                        const dataIndex = context[0].dataIndex;
                        const names = context[0].dataset.sujetNames[dataIndex];
                        const namesToShow = names.slice(0, 10);
                        let namesString = namesToShow.join('\n');
                        if (names.length > 10) {
                            namesString += `\n... et ${names.length - 10} autre(s)`;
                        }
                        return '\n' + namesString;
                    }
                }
            }
        },
        cutout: '60%'
    }
});
}
function getAllCategoryStatsForLang(langCode) {
    const stats = {};
    const sujets = sujetsDataGlobal.filter(p => (p.language || 'fr') === langCode);
    const possibleAges = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    sujets.forEach(p => {
        const catKey = p.category || 'unclassified';
        if (!stats[catKey]) {
            stats[catKey] = {
                key: catKey,
                name: getTranslatedCategoryName(p.category, langCode),
                total: 0,
                withAge: 0,
                ageDistribution: possibleAges.reduce((acc, age) => ({...acc, [age]: 0}), {})
            };
        }
        stats[catKey].total++;
        if (p.minrecommandedAge !== undefined || p.maxrecommandedAge !== undefined) {
            stats[catKey].withAge++;
            const startAge = p.minrecommandedAge || 3;
            const endAge = p.maxrecommandedAge || 12;
            for (let age = startAge; age <= endAge; age++) {
                if (stats[catKey].ageDistribution[age] !== undefined) {
                    stats[catKey].ageDistribution[age]++;
                }
            }
        }
    });
    return Object.values(stats);
}
function runDatabaseAudit() {
    auditModalTitle.textContent = translations[currentLang].auditModalTitle;
    auditReportContent.innerHTML = '<div class="loader"></div>';
    auditReportModal.classList.add('open');
    auditReportModal.style.display = 'flex';
    setTimeout(() => {
        const results = {
            incoherentAges: findIncoherentAges(),
            uncategorized: findUncategorized(),
            identicalTranslations: findIdenticalTranslations(),
        };
        displayAuditReport(results);
    }, 200);
}
function findUncategorized() {
    return sujetsDataGlobal.filter(p => !p.category || p.category.trim() === '');
}
function findIdenticalTranslations() {
    return sujetsDataGlobal.filter(p =>
        p.language && p.language !== 'fr' &&
        p.originalName_fr &&
        p.name.trim().toLowerCase() === p.originalName_fr.trim().toLowerCase()
    );
}
function findIncoherentAges() {
    return sujetsDataGlobal.filter(p =>
        typeof p.minrecommandedAge === 'number' &&
        typeof p.maxrecommandedAge === 'number' &&
        p.minrecommandedAge > p.maxrecommandedAge
    );
}
function displayAuditReport(results) {
    const auditTypes = [
        { id: 'incoherentAges', titleKey: 'auditIncoherentAges', icon: '↔️', severity: 'high' },
        { id: 'uncategorized', titleKey: 'auditUncategorized', icon: '🏷️', severity: 'medium' },
        { id: 'identicalTranslations', titleKey: 'auditIdenticalTranslations', icon: '🟰', severity: 'low' },
    ];
    const totalIssues = auditTypes.reduce((sum, type) => sum + results[type.id].length, 0);
    if (totalIssues === 0) {
        auditReportContent.innerHTML = `
            <div class="audit-all-clear">
                <div class="icon">✅</div>
                <h4>${translations[currentLang].auditNoIssues || "Aucun problème détecté !"}</h4>
                <p>${translations[currentLang].auditAllClearMessage || "Votre base de données semble en excellente condition."}</p>
            </div>`;
        return;
    }
    let kpisHtml = auditTypes.map(type => {
        const count = results[type.id].length;
        if (count === 0) return '';
        return `<div class="audit-kpi-card severity-${type.severity}"><div class="kpi-title">${translations[currentLang][type.titleKey]}</div><div class="kpi-value">${count}</div></div>`;
    }).join('');
    let navHtml = '';
    let firstActiveTabSet = false;
    navHtml = auditTypes.map(type => {
        const count = results[type.id].length;
        if (count === 0) return '';
        let activeClass = '';
        if (!firstActiveTabSet) {
            activeClass = 'active';
            firstActiveTabSet = true;
        }
        return `<button class="audit-nav-btn ${type.severity ? `severity-${type.severity}` : ''} ${activeClass}" data-target-panel="#audit-panel-${type.id}"><span class="icon">${type.icon}</span><span>${translations[currentLang][type.titleKey]}</span><span class="count">${count}</span></button>`;
    }).join('');
    let panelsHtml = '';
    firstActiveTabSet = false;
    panelsHtml = auditTypes.map(type => {
        const items = results[type.id];
        if (items.length === 0) return '';
        let activeClass = '';
        if (!firstActiveTabSet) {
            activeClass = 'active';
            firstActiveTabSet = true;
        }
        const itemsHtml = items.sort((a, b) => a.name.localeCompare(b.name, currentLang)).map(item => formatAuditItem(item, type.id, type.severity)).join('');
        return `<div class="audit-panel ${activeClass}" id="audit-panel-${type.id}">${itemsHtml}</div>`;
    }).join('');
    auditReportContent.innerHTML = `<div id="audit-summary-kpis">${kpisHtml}</div><nav class="audit-nav">${navHtml}</nav><div class="audit-panels">${panelsHtml}</div>`;
    const auditNavButtons = auditReportContent.querySelectorAll('.audit-nav-btn');
    auditNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            auditNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetPanelId = button.dataset.targetPanel;
            auditReportContent.querySelectorAll('.audit-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            auditReportContent.querySelector(targetPanelId).classList.add('active');
        });
    });
}
function formatAuditItem(item, type, severity) {
    let infoHtml = '';
    const langTag = `<span class="lang-tag">${item.language || 'fr'}</span>`;
    switch (type) {
        case 'incoherentAges':
            infoHtml = `<strong>${item.name}</strong> ${langTag}<div class="meta">Âge invalide : ${item.minrecommandedAge} > ${item.maxrecommandedAge} | Cat: ${getTranslatedCategoryName(item.category, item.language || 'fr')}</div>`;
            break;
        case 'uncategorized':
            infoHtml = `<strong>${item.name}</strong> ${langTag}<div class="meta">Ce sujet n'a pas de catégorie.</div>`;
            break;
        case 'identicalTranslations':
            infoHtml = `<strong>${item.name}</strong> ${langTag}<div class="meta">Traduction identique à l'original (FR) | Cat: ${getTranslatedCategoryName(item.category, item.language)}</div>`;
            break;
    }
    return `<div class="audit-item severity-${severity}"><div class="audit-item-info">${infoHtml}</div></div>`;
}
function initializeApp(data) {
    allCategoriesGlobal = [];
    explicitlySelectedCategoryKey = null;
    if (tierFiltersContainer) {
        activeTierFilters.clear();
        tierFiltersContainer.querySelectorAll('.tier-filter-btn').forEach(btn => btn.classList.remove('active'));
        const allButton = tierFiltersContainer.querySelector('[data-tier="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    }
    let sujetsArray = [];
    if (Array.isArray(data)) {
        console.warn("Ancien format JSON détecté (tableau simple)...");
        sujetsArray = data;
        const tempCatKeys = new Set();
        sujetsArray.forEach(p => {
            if (p.category && typeof p.category === 'string' && p.category.trim() !== "") {
                tempCatKeys.add(getCanonicalCategoryKey(p.category, p.language || 'fr'));
            }
        });
        allCategoriesGlobal = [...tempCatKeys];
    } else if (typeof data === 'object' && data !== null && (Array.isArray(data.sujets) || Array.isArray(data.passions))) {
        sujetsArray = data.sujets || data.passions;
        if (Array.isArray(data.categories)) {
            allCategoriesGlobal = [...new Set(data.categories.map(c => (typeof c === 'string' ? c.trim() : (c?.name?.trim() || null))).filter(name => name && name.trim() !== ""))];
        } else {
            const tempCatKeys = new Set();
            sujetsArray.forEach(p => {
                if (p.category && typeof p.category === 'string' && p.category.trim() !== "") {
                    tempCatKeys.add(getCanonicalCategoryKey(p.category, p.language || 'fr'));
                }
            });
            allCategoriesGlobal = [...tempCatKeys];
        }
        if (data.categoryMetadata) {
            for (const catKey in data.categoryMetadata) {
                if (data.categoryMetadata[catKey].color) {
                    categoryColorMap[catKey] = { color: data.categoryMetadata[catKey].color, custom: true };
                }
            }
        }
    } else {
        console.error("Format de données JSON non reconnu.");
        showToast('jsonNotArrayError', 'error', 7000);
        sujetsArray = [];
    }
    if (translations.fr && translations.fr.categoryNames) {
        Object.keys(translations.fr.categoryNames).forEach(key => {
            if (!allCategoriesGlobal.includes(key)) {
                allCategoriesGlobal.push(key);
            }
        });
    }
    allCategoriesGlobal = [...new Set(allCategoriesGlobal)];
    populateTranslationsFromData({ sujets: sujetsArray, categories: allCategoriesGlobal });
    fallbackColorIndex = 0;
    nextSujetId = data.nextId || 0;
    
    sujetsDataGlobal = sujetsArray.map((p, index) => {
        const id = p.id || `sujet-${nextSujetId++}`;
        if (p.id === undefined) nextSujetId = Math.max(nextSujetId, index + 1);
        const sujetName = String(p.name || "Sans Nom").trim();
        const originalLanguageOfSujet = p.language || "fr";
        let rawCategoryFromFile = (p.category === null || p.category === undefined) ? "" : String(p.category).trim();
        let canonicalCatKey = getCanonicalCategoryKey(rawCategoryFromFile, originalLanguageOfSujet);
        if (canonicalCatKey && !allCategoriesGlobal.includes(canonicalCatKey)) {
            allCategoriesGlobal.push(canonicalCatKey);
            if (translations.fr && translations.fr.categoryNames && !translations.fr.categoryNames.hasOwnProperty(canonicalCatKey)) {
                translations.fr.categoryNames[canonicalCatKey] = canonicalCatKey;
                ['en', 'de', 'es'].forEach(lang => {
                    if (translations[lang] && translations[lang].categoryNames && !translations[lang].categoryNames.hasOwnProperty(canonicalCatKey)) {
                        translations[lang].categoryNames[canonicalCatKey] = canonicalCatKey;
                    }
                });
            }
        }
        const originalNameForFr = p.originalName_fr || ((originalLanguageOfSujet === 'fr' || !p.language) ? sujetName : "");
        const tierValue = p.Tier !== undefined ? p.Tier : p.tier;
        
        const minAge = p.minRecommendedAge !== undefined ? p.minRecommendedAge : p.recommendedAge;
        const maxAge = p.maxRecommendedAge;
        return { ...p, id: id, Tier: tierValue, Key: generateSujetKey(canonicalCatKey, originalNameForFr || sujetName), name: sujetName, originalName_fr: originalNameForFr, category: canonicalCatKey, language: originalLanguageOfSujet, minrecommandedAge: typeof minAge === 'number' ? minAge : undefined, maxrecommandedAge: typeof maxAge === 'number' ? maxAge : undefined };
    }).filter(p => p !== null);
    let maxMappedId = 0;
    sujetsDataGlobal.forEach(p => {
        if (p.id && p.id.toString().startsWith('sujet-')) {
            const numId = parseInt(p.id.toString().replace('sujet-', ''), 10);
            if (!isNaN(numId)) maxMappedId = Math.max(maxMappedId, numId);
        }
    });
    nextSujetId = Math.max(nextSujetId, maxMappedId + 1);
    updateAllCategoriesGlobal();
    let initialLang = 'fr';
    if (localStorage.getItem('lookizLangVisitedBefore')) {
    initialLang = localStorage.getItem('lookizLang') || 'fr';
}
localStorage.setItem('lookizLangVisitedBefore', 'true');
currentLang = initialLang;
languageFilterSelect.value = initialLang;
translationTargetLangSelect.value = localStorage.getItem('lookizTargetTranslationLang') || 'en';
const savedTheme = localStorage.getItem('lookizTheme') || 'light';
applyTheme(savedTheme);
initCustomTranslateDropdown();
initCustomUiLangDropdown();
translatePage(initialLang);
if (!initializeApp.listenersAttached) {
    bulkSelectAllBtn.addEventListener('click', selectAllSujets);
    bulkDeselectAllBtn.addEventListener('click', deselectAllSujets);
    themeToggleButton.addEventListener('click', toggleTheme);
    sidebarToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); openSidebar(); });
    sidebarCloseBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    sidebarCategoryList.addEventListener('click', (event) => {
        let targetLink = event.target.closest('a');
        if (targetLink && targetLink.dataset.category !== undefined) {
            event.preventDefault();
            activeTierFilters.clear();
            document.querySelectorAll('.tier-filter-btn').forEach(btn => btn.classList.remove('active'));
            if(document.querySelector('.tier-filter-btn[data-tier="all"]')) document.querySelector('.tier-filter-btn[data-tier="all"]').classList.add('active');
            if (gotoPopularLink) gotoPopularLink.classList.remove('active');
            const categoryFromSidebar = targetLink.dataset.category;
            if (categoryFromSidebar === "all") {
                explicitlySelectedCategoryKey = "all_explicit";
                categoryFilterSelect.value = "all_explicit";
            } else {
                explicitlySelectedCategoryKey = categoryFromSidebar;
                categoryFilterSelect.value = categoryFromSidebar;
            }
            searchSujetInput.value = '';
            resetAgeFilter();
            handleFilterChange();
            if (window.innerWidth < 992 && sidebar.classList.contains('open')) closeSidebar();
            if (document.getElementById('sujets-grid')) {
                const delay = (window.innerWidth < 992 && sidebar.classList.contains('open')) ? (parseFloat(getComputedStyle(sidebar).getPropertyValue('--sidebar-transition-speed').replace('s', '')) * 1000) + 50 : 50;
                setTimeout(() => document.getElementById('sujets-grid').scrollIntoView({ behavior: 'smooth', block: 'start' }), delay);
            }
        }
    });
    gotoQuickStatsLink.addEventListener('click', (e) => handleNavLinkClick(e, 'quick-stats-bar'));
    gotoStatsLink.addEventListener('click', (e) => handleNavLinkClick(e, 'stats-section'));
    gotoChartsLink.addEventListener('click', (e) => handleNavLinkClick(e, 'charts-section'));

    if (tierFiltersContainer) {
        tierFiltersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tier-filter-btn')) {
                const clickedButton = e.target;
                if (clickedButton.id === 'open-bulk-transfer-modal-btn') return;
                const clickedTier = clickedButton.dataset.tier;
                const isAlreadyActive = clickedButton.classList.contains('active');
                tierFiltersContainer.querySelectorAll('.tier-filter-btn').forEach(btn => btn.classList.remove('active'));
                activeTierFilters.clear();
                if (!isAlreadyActive) {
                    clickedButton.classList.add('active');
                    if (clickedTier !== 'all') {
                        activeTierFilters.add(clickedTier);
                    }
                }
                handleFilterChange();
            }
        });
    }
    gotoTopLinkSidebar.addEventListener('click', (e) => handleNavLinkClick(e, 'page-top'));
    window.addEventListener('scroll', () => {
        backToTopBtn.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) ? "block" : "none";
    });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    languageFilterSelect.addEventListener('change', (event) => {
        localStorage.setItem('lookizLang', event.target.value);
        explicitlySelectedCategoryKey = null;
        categoryFilterSelect.value = "all";
        searchSujetInput.value = '';
        resetAgeFilter();
        translatePage(event.target.value);
    if (openBulkTransferBtn) {
        openBulkTransferBtn.addEventListener('click', openBulkTransferModal);
    }
    if (bulkTransferModalCloseBtn) {
        bulkTransferModalCloseBtn.addEventListener('click', closeBulkTransferModal);
    }
    if (bulkTransferSelectAllBtn) {
        bulkTransferSelectAllBtn.addEventListener('click', toggleSelectAllBulkTransfer);
    }
    if (bulkTransferConfirmBtn) {
        bulkTransferConfirmBtn.addEventListener('click', handleBulkTransfer);
    }
    if (transferTierModalCloseBtn) {
        transferTierModalCloseBtn.addEventListener('click', closeTransferTierModal);
    }

    });
    translationTargetLangSelect.addEventListener('change', (event) => {
        localStorage.setItem('lookizTargetTranslationLang', event.target.value);
        updateCustomTranslateButtonDisplay(event.target.value);
    });
    searchSujetInput.addEventListener('input', () => {
        handleFilterChange();
    });
    if(minAgeFilterInput) {
        minAgeFilterInput.addEventListener('input', (e) => {
            if (ageAnyFilterCheckbox) ageAnyFilterCheckbox.checked = false;
            if (e.target.value) {
                let value = parseInt(e.target.value, 10);
                if (value < 3) e.target.value = 3;
                if (value > 12) e.target.value = 12;
            }
            handleFilterChange();
        });
    }
    if(maxAgeFilterInput) {
        maxAgeFilterInput.addEventListener('input', (e) => {
            if (ageAnyFilterCheckbox) ageAnyFilterCheckbox.checked = false;
            if (e.target.value) {
                let value = parseInt(e.target.value, 10);
                if (value < 3) e.target.value = 3;
                if (value > 12) e.target.value = 12;
            }
            handleFilterChange();
        });
    }
    if(ageAnyFilterCheckbox) {
        ageAnyFilterCheckbox.addEventListener('change', () => {
            if (ageAnyFilterCheckbox.checked) {
                if(minAgeFilterInput) minAgeFilterInput.value = '';
                if(maxAgeFilterInput) maxAgeFilterInput.value = '';
            }
            handleFilterChange();
        });
    }
    if(ageFilterResetBtn) ageFilterResetBtn.addEventListener('click', resetAgeFilter);
    if (searchSujetActionBtn) {
        searchSujetActionBtn.addEventListener('click', () => {
            handleFilterChange();
            searchSujetInput.focus();
            const searchTerm = searchSujetInput.value.trim();
            if (searchTerm) {
                const resultsGrid = document.getElementById('sujets-grid');
                if (resultsGrid) {
                    resultsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
    document.getElementById('file-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    initializeApp(jsonData);
                    searchSujetInput.value = '';
                    resetAgeFilter();
                    dataHasBeenModified = true;
                    saveDataToLocalStorage();
                    showToast('fileLoaded', 'success');
                } catch (error) {
                    console.error('Erreur parsing JSON:', error);
                    let errorKey = 'errorJsonFileInvalid';
                    if (error.message.includes("Format de données JSON non reconnu")) {
                        errorKey = 'jsonNotArrayError';
                    }
                    showToast(errorKey, 'error');
                }
            };
            reader.readAsText(file);
        }
    });
    addCategoryBtnGlobal.addEventListener('click', handleAddCategory);
    newCategoryNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCategory();
        }
    });
    if (openLangHubBtn) openLangHubBtn.addEventListener('click', openLangHubModal);
    if (langHubModalCloseBtn) langHubModalCloseBtn.addEventListener('click', closeLangHubModal);
    if (hubNavButtons) hubNavButtons.forEach(button => button.addEventListener('click', () => switchHubTab(button)));
    if (advStatsSortFilter) {
        advStatsSortFilter.addEventListener('change', displayAdvancedStats);
    }
    if (addSujetBtn) addSujetBtn.addEventListener('click', () => handleAddSujetClick(null));
    if (translateAllVisibleBtn) translateAllVisibleBtn.addEventListener('click', handleTranslateAllVisibleSujets);
    if (downloadAllBtn) downloadAllBtn.addEventListener('click', openSaveOptionsModal);
    if (runAuditBtn) runAuditBtn.addEventListener('click', runDatabaseAudit);
    if (auditModalCloseBtn) auditModalCloseBtn.addEventListener('click', () => {
        auditReportModal.classList.remove('open');
        setTimeout(() => { auditReportModal.style.display = 'none'; }, 300);
    });
    if (ageDetailsModalCloseBtn) ageDetailsModalCloseBtn.addEventListener('click', closeAgeDetailsChartModal);
    if (openSuggestionsBtn) openSuggestionsBtn.addEventListener('click', openSuggestionsModal);
    if (openRecommendationsBtn) openRecommendationsBtn.addEventListener('click', openRecommendationsModal);
    if (suggestionsModalCloseBtn) suggestionsModalCloseBtn.addEventListener('click', closeSuggestionsModal);
    if (recommendationsModalCloseBtn) recommendationsModalCloseBtn.addEventListener('click', closeRecommendationsModal);
    if (translationProgressCancelBtn) {
        translationProgressCancelBtn.addEventListener('click', () => {
            isTranslationCancelled = true;
            showToast('translationCancelledText', 'info');
            if (translationProgressBar) {
                translationProgressBar.classList.add('cancelled');
                translationProgressBar.setAttribute('data-progress-text', (translations[currentLang]?.translationCancelledText || 'Annulé !'));
            }
        });
    }
    if (translateCategoriesModalCloseBtn) translateCategoriesModalCloseBtn.addEventListener('click', closeTranslateCategoriesModal);
    if (translateCategoriesSelectAllBtn) translateCategoriesSelectAllBtn.addEventListener('click', toggleSelectAllCategoriesModal);
    if (translateCategoriesConfirmBtn) translateCategoriesConfirmBtn.addEventListener('click', handleTranslateSelectedCategories);
    if (saveOptionsModalCloseBtn) saveOptionsModalCloseBtn.addEventListener('click', closeSaveOptionsModal);
    if (saveOptionsConfirmBtn) saveOptionsConfirmBtn.addEventListener('click', handleSaveWithOptions);
    document.querySelectorAll('input[name="save-option"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const categoryContainer = document.getElementById('save-category-selector-container');
            const languageContainer = document.getElementById('save-language-selector-container');
            categoryContainer.style.display = 'none';
            languageContainer.style.display = 'none';
            if (this.value === 'category') {
                populateSaveCategorySelect();
                categoryContainer.style.display = 'block';
            } else if (this.value === 'language') {
                populateSaveLanguageSelect();
                languageContainer.style.display = 'block';
            }
        });
    });
    window.addEventListener('click', (event) => {
        if (event.target == translateCategoriesModal) closeTranslateCategoriesModal();
        if (event.target == saveOptionsModal) closeSaveOptionsModal();
        if (event.target == langHubModal) closeLangHubModal();
        if (event.target == auditReportModal) {
            auditReportModal.classList.remove('open');
            setTimeout(() => { auditReportModal.style.display = 'none'; }, 300);
        }
        if (event.target == suggestionsModal) closeSuggestionsModal();
        if (event.target == recommendationsModal) closeRecommendationsModal();
        if (event.target == ageDetailsChartModal) closeAgeDetailsChartModal();
        if (event.target == bulkTransferModal) closeBulkTransferModal();
    });
    if (openBulkTransferBtn) {
        openBulkTransferBtn.addEventListener('click', openBulkTransferModal);
    }
    if (bulkTransferModalCloseBtn) {
        bulkTransferModalCloseBtn.addEventListener('click', closeBulkTransferModal);
    }
    if (bulkTransferSelectAllBtn) {
        bulkTransferSelectAllBtn.addEventListener('click', toggleSelectAllBulkTransfer);
    }
    if (bulkTransferConfirmBtn) {
        bulkTransferConfirmBtn.addEventListener('click', handleBulkTransfer);
    }
    if (transferTierModalCloseBtn) {
        transferTierModalCloseBtn.addEventListener('click', closeTransferTierModal);
    }
    if (transferTierModal) {
        transferTierModal.querySelectorAll('.btn-tier-choice').forEach(button => {
            button.addEventListener('click', () => {
                const sujetId = transferTierModal.dataset.sujetId;
                const newTier = parseInt(button.dataset.tier, 10);
                if (sujetId !== undefined && newTier !== undefined) {
                    confirmTierTransfer(sujetId, newTier);
                }
            });
        });
        transferTierModal.addEventListener('click', (event) => {
            if (event.target === transferTierModal) {
                closeTransferTierModal();
            }
        });
    }
    window.addEventListener('beforeunload', (event) => { if (dataHasBeenModified) { saveDataToLocalStorage(); const confirmationMessage = translations[currentLang]?.confirmPageLeave || "Des modifications non sauvegardées pourraient être perdues..."; event.preventDefault(); event.returnValue = confirmationMessage; return confirmationMessage; } });
    const categoryInput = document.getElementById('new-category-name-input');
    const clearBtn = categoryInput.nextElementSibling;
    if (categoryInput && clearBtn && clearBtn.classList.contains('input-clear-btn')) {
        const toggleClearButton = () => {
            clearBtn.style.display = categoryInput.value ? 'block' : 'none';
        };
        categoryInput.addEventListener('input', toggleClearButton);
        clearBtn.addEventListener('click', () => {
            categoryInput.value = '';
            toggleClearButton();
            categoryInput.focus();
            categoryInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
        toggleClearButton();
    }
    initializeApp.listenersAttached = true;
    bulkDeselectAllBtn.addEventListener('click', deselectAllSujets);
    bulkActionChangeCategoryBtn.addEventListener('click', openBulkChangeCategoryModal);
    bulkActionChangeAgeBtn.addEventListener('click', openBulkChangeAgeModal);
    bulkActionDeleteBtn.addEventListener('click', handleBulkDelete);
    bulkEditCategoryModalCloseBtn.addEventListener('click', closeBulkModals);
    bulkEditAgeModalCloseBtn.addEventListener('click', closeBulkModals);
    bulkEditCategoryConfirmBtn.addEventListener('click', applyBulkCategoryChange);
    bulkEditAgeConfirmBtn.addEventListener('click', applyBulkAgeChange);
    bulkAnyAgeCheckbox.addEventListener('change', () => {
        const isDisabled = bulkAnyAgeCheckbox.checked;
        bulkMinAgeInput.disabled = isDisabled;
        bulkMaxAgeInput.disabled = isDisabled;
        if (isDisabled) {
            bulkMinAgeInput.value = '';
            bulkMaxAgeInput.value = '';
        }
    });
    window.addEventListener('click', (event) => {
        if (event.target == bulkEditCategoryModal) closeBulkModals();
        if (event.target == bulkEditAgeModal) closeBulkModals();
    });
    const resetSelectionOnFilterChange = () => {
        if (selectedSujetIds.size > 0) {
            deselectAllSujets();
        }
    };
    languageFilterSelect.addEventListener('change', resetSelectionOnFilterChange);
    categoryFilterSelect.addEventListener('change', resetSelectionOnFilterChange);
    searchSujetInput.addEventListener('input', resetSelectionOnFilterChange);
    minAgeFilterInput.addEventListener('input', resetSelectionOnFilterChange);
    maxAgeFilterInput.addEventListener('input', resetSelectionOnFilterChange);
    ageAnyFilterCheckbox.addEventListener('change', resetSelectionOnFilterChange);
    initializeApp.listenersAttached = true;
    categoryFilterSelect.removeEventListener('change', handleCategoryFilterSelectChange);
    categoryFilterSelect.addEventListener('change', handleCategoryFilterSelectChange);
    updateSaveReminder();
}
}
function handleCategoryFilterSelectChange(e) {
    const selectedValue = e.target.value;
    if (selectedValue === "all") { explicitlySelectedCategoryKey = null; }
    else if (selectedValue === "all_explicit" || selectedValue === "Populaire") {
        explicitlySelectedCategoryKey = "all_explicit";
    }
    else { explicitlySelectedCategoryKey = selectedValue; }
    searchSujetInput.value = '';
    resetAgeFilter();
    handleFilterChange();
}
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }
    initDomElements();
    let dataLoadedFromStorage = loadDataFromLocalStorage();
    if (!dataLoadedFromStorage) {
        fetch('Francais.json')
            .then(response => { if (!response.ok) { console.error(`HTTP error! status: ${response.status}`); throw new Error(`HTTP_ERROR ${response.status}`); } return response.text().then(text => { try { return JSON.parse(text); } catch (e) { console.error("Erreur parsing Francais.json:", e); throw new Error("JSON_PARSE_ERROR"); } }); })
            .then(data => { initializeApp(data); saveDataToLocalStorage(); })
            .catch(error => {
                console.error('Erreur chargement initial:', error.message);
                const langForError = currentLang || 'fr';
                let userMessageKey = 'errorLoadingDefaultFileNotFound';
                if (error.message.includes("HTTP_ERROR")) { userMessageKey = 'errorLoadingDefaultFileNotFound'; } else if (error.message === "JSON_PARSE_ERROR") { userMessageKey = 'errorJsonFileInvalid'; }
                initializeApp({ sujets: [], categories: [], nextId: 0, categoryMetadata: {} });
                showToast(userMessageKey, 'error', 7000);
                const defaultErrorMessage = (userMessageKey === 'errorLoadingDefaultFileNotFound') ? (translations[langForError]?.[userMessageKey] || "Please insert a JSON file to start.") : `${translations[langForError]?.[userMessageKey] || "Error loading data."} ${translations[langForError]?.promptChooseFile || "Please choose a file."}`;
                if (sujetsGrid) sujetsGrid.innerHTML = `<p class="message">${translations[langForError]?.promptSelectCategoryForSujets || "Select a category..."}</p>`;
                if (categoryStatsContainer) categoryStatsContainer.innerHTML = `<p class="message">${translations[langForError]?.errorLoadingStats || "Error loading stats."}</p>`;
                if (categorySelectionGrid) categorySelectionGrid.innerHTML = `<p class="message">${defaultErrorMessage}</p>`;
                const chartErrorMsg = `<p class="message">${translations[currentLang]?.errorLoadingCharts || "Data unavailable for chart."}</p>`;
                const catChartContainer = document.getElementById('category-chart-container')?.querySelector('.canvas-container');
                const ageChartContainer = document.getElementById('age-chart-container')?.querySelector('.canvas-container');
                if (catChartContainer) catChartContainer.innerHTML = chartErrorMsg;
                if (ageChartContainer) ageChartContainer.innerHTML = chartErrorMsg;
                updateQuickStats();
                updateCustomUiLangButtonDisplay(currentLang);
            });
    } else {
        explicitlySelectedCategoryKey = null;
        initializeApp({ sujets: sujetsDataGlobal, categories: allCategoriesGlobal, nextId: nextSujetId, categoryMetadata: categoryColorMap });
    }
});
function openSuggestionsModal() {
    if (!suggestionsModal || !suggestionsListContainer || !suggestionsModalTitle) return;
    suggestionsModalTitle.textContent = translations[currentLang]?.suggestionModalTitle || 'Suggestions de sujets de discussion';
    if (Object.keys(currentSuggestions).length > 0) {
        renderSuggestions(currentSuggestions);
    } else {
        suggestionsListContainer.innerHTML = `
            <div class="ia-generation-container">
                <button id="btn-generate-ia" class="btn-generate-ia">
                    <span class="icon" aria-hidden="true">✨</span>
                    <span class="text-label">${translations[currentLang].generateMoreSuggestions || 'Générer des suggestions'}</span>
                </button>
            </div>
        `;
        document.getElementById('btn-generate-ia').addEventListener('click', generateAndDisplaySuggestions);
    }
    suggestionsModal.classList.add('open');
    suggestionsModal.style.display = 'flex';
}
function closeSuggestionsModal() {
    if (!suggestionsModal) return;
    suggestionsModal.classList.remove('open');
    setTimeout(() => {
        suggestionsModal.style.display = 'none';
        if (suggestionsWereAdded) {
            saveDataToLocalStorage();
            refreshAllViews();
        }
        suggestionsWereAdded = false;
    }, 300);
}
function findCategoriesForSuggestions(count = 3) {
    const coreCategories = ["Science", "Histoire", "Animaux", "Art", "Nature", "Sport", "Musique", "Technologie", "Aventure", "Cuisine", "Collection", "Fiction", "Géographie", "Jeux"];
    const availableCategories = coreCategories.filter(catKey => allCategoriesGlobal.includes(catKey));
    if (availableCategories.length <= count) {
        return availableCategories;
    }
    for (let i = availableCategories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableCategories[i], availableCategories[j]] = [availableCategories[j], availableCategories[i]];
    }
    return availableCategories.slice(0, count);
}
async function callOpenRouterForSuggestions(category, existingSujets) {
    const validKeys = getOpenRouterApiKey();
    if (!validKeys || validKeys.length === 0) {
        showToast('translationErrorApiKey', 'error');
        return null;
    }
    const maxRetries = 3;
    const initialDelay = 1000;
    const model = "mistralai/mistral-7b-instruct:free";
    const prompt = `
Tu es un générateur d'idées pour une application éducative destinée aux enfants de 3 à 12 ans.
Ta tâche est de proposer 5 nouveaux sujets de discussion originaux, spécifiques et adaptés à 
l’âge ciblé, dans la catégorie "${category}". Tes réponses doivent être en **français**.
🚫 Important : N’inclus aucun des sujets suivants, déjà présents dans cette catégorie :
"${existingSujets.join(', ')}"
🎯 Les suggestions doivent être :
- Courtes (2 à 5 mots maximum)
- Claires et compréhensibles pour des enfants
- Sans doublons sémantiques ni variantes inutiles
🛑 Ne génère aucun texte explicatif, aucun commentaire, ni aucune structure supplémentaire.
✅ Réponds uniquement avec un objet JSON de ce format précis :
{
  "suggestions": ["Idée 1", "Idée 2", "Idée 3", "Idée 4", "Idée 5"]
}
    `;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = validKeys[(currentApiKeyIndex + attempt) % validKeys.length];
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": OPENROUTER_REFERRER,
                    "X-Title": OPENROUTER_APP_TITLE
                },
                body: JSON.stringify({
                    "model": model,
                    "messages": [{ "role": "user", "content": prompt }],
                    "response_format": { "type": "json_object" },
                    "temperature": 0.8
                })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0].message.content) {
                    const content = JSON.parse(data.choices[0].message.content);
                    if (content.suggestions && Array.isArray(content.suggestions)) {
                        currentApiKeyIndex = (currentApiKeyIndex + attempt) % validKeys.length;
                        return content.suggestions;
                    }
                }
            }
            console.warn(`Tentative de suggestion ${attempt + 1} échouée. Statut: ${response.status}`);
        } catch (error) {
            console.warn(`Tentative de suggestion ${attempt + 1} échouée (erreur réseau). Erreur:`, error);
        }
        if (attempt < maxRetries - 1) {
            const delay = initialDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    console.error(`Échec définitif de la génération de suggestions pour la catégorie "${category}" après ${maxRetries} tentatives.`);
    showToast('translationError', 'error');
    currentApiKeyIndex = (currentApiKeyIndex + 1) % validKeys.length;
    return null;
}
function normalizeStringForComparison(str) {
    return str.toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/^(le|la|les|l'|un|une|des)\s*/, '')
              .trim();
}
async function handleTranslateCategoryPermanently(categoryKeys) {
    const targetLang = translationTargetLangSelect.value;
    const sourceLang = languageFilterSelect.value;
    if (!targetLang || targetLang === sourceLang) {
        showToast('customTranslateDropdownDefaultText', 'error');
        return;
    }
    const sujetsToTranslate = sujetsDataGlobal.filter(p =>
        categoryKeys.includes(p.category) &&
        (p.language || 'fr') === sourceLang &&
        !sujetsDataGlobal.some(existing => existing.Key === p.Key && existing.language === targetLang)
    );
    if (sujetsToTranslate.length === 0) {
        showToast('noSujetsInCategoryToTranslate', 'info');
        return;
    }
    showTranslationProgress(sujetsToTranslate.length);
    isTranslationCancelled = false;
    let localNewlyTranslatedSujets = [];
    let successCount = 0;
    let failCount = 0;
    let itemsProcessed = 0;
    const concurrencyLimit = CONCURRENT_TRANSLATIONS_LIMIT;
    const activePromises = new Set();
    for (const sujet of sujetsToTranslate) {
        if (isTranslationCancelled) break;
        if (activePromises.size >= concurrencyLimit) {
            await Promise.race(activePromises);
        }
        const promise = (async () => {
            const newSujet = await translateSingleSujet(sujet, targetLang, sourceLang);
            if (!isTranslationCancelled) {
                if (newSujet) {
                    localNewlyTranslatedSujets.push(newSujet);
                    successCount++;
                } else {
                    failCount++;
                }
                itemsProcessed++;
                updateTranslationProgress(itemsProcessed, sujetsToTranslate.length);
            }
        })();
        activePromises.add(promise);
        promise.finally(() => {
            activePromises.delete(promise);
        });
    }
    await Promise.all(activePromises);
    hideTranslationProgress();
    if (!isTranslationCancelled) {
        const summaryMsgKey = 'translationBatchSummary';
        const successLabel = translations[currentLang]?.labelSuccessSuffix || 'réussie(s)';
        const failLabel = translations[currentLang]?.labelFailSuffix || 'échec(s)';
        const summary = (translations[currentLang][summaryMsgKey] || "")
            .replace('{success}', successCount)
            .replace('{labelSuccess}', successLabel)
            .replace('{fail}', failCount)
            .replace('{labelFail}', failLabel);
        showToast(summary, failCount > 0 ? 'error' : 'success', 5000);
        if (successCount > 0) {
            sujetsDataGlobal.push(...localNewlyTranslatedSujets);
            dataHasBeenModified = true;
            saveDataToLocalStorage();
            refreshAllViews();
            const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === targetLang)?.textContent || targetLang;
            showToast(translations[currentLang].translationSuccessSingle.replace('{langName}', langName), 'success', 5000);
        }
    }
}
async function handleTranslateSujet(sujetId, cardElement) {
    if (!cardElement) return;
    const translateButton = cardElement.querySelector('.sujet-card-actions .btn-translate');
    if (translateButton) translateButton.disabled = true;
    const targetLang = translationTargetLangSelect.value;
    if (!targetLang || targetLang === currentLang) {
        showToast('customTranslateDropdownDefaultText', 'error');
        if (translateButton) translateButton.disabled = false;
        return;
    }
    const sujet = sujetsDataGlobal.find(p => p.id === sujetId);
    if (!sujet) {
        showToast('errorSujetNotFoundEdit', 'error');
        if (translateButton) translateButton.disabled = false;
        return;
    }
    if (sujetsDataGlobal.some(p => p.Key === sujet.Key && p.language === targetLang)) {
        showToast('sujetAlreadyTranslated', 'info');
        if (translateButton) translateButton.disabled = false;
        return;
    }
    const sourceLangForAPI = sujet.language || 'fr';
    try {
        const newSujetObject = await translateSingleSujet(sujet, targetLang, sourceLangForAPI);
        if (newSujetObject) {
            sujetsDataGlobal.unshift(newSujetObject);
            dataHasBeenModified = true;
            saveDataToLocalStorage();
            refreshAllViews();
            const langName = Array.from(languageFilterSelect.options).find(opt => opt.value === targetLang)?.textContent || targetLang;
            showToast(translations[currentLang].translationSuccessSingle.replace('{langName}', langName), 'success', 5000);
        } else {
            showToast('translationError', 'error');
        }
    } catch (error) {
        console.error("Erreur dans handleTranslateSujet:", error);
        showToast('translationError', 'error');
    } finally {
        if (translateButton) translateButton.disabled = false;
    }
}
async function generateAndDisplaySuggestions() {
    const generateBtn = document.getElementById('btn-generate-ia');
    const icon = generateBtn.querySelector('.icon');
    const textLabel = generateBtn.querySelector('.text-label');
    generateBtn.disabled = true;
    icon.classList.add('spinning');
    textLabel.textContent = translations[currentLang].generatingSuggestions || 'Génération en cours...';
    const categoriesToFetch = findCategoriesForSuggestions(2);
    let totalFound = 0;
    for (const categoryKey of categoriesToFetch) {
        const existingLocalAndGlobal = sujetsDataGlobal
            .filter(p => p.category === categoryKey)
            .map(p => p.name)
            .concat(currentSuggestions[categoryKey] || []);
        const suggestions = await callOpenRouterForSuggestions(getTranslatedCategoryName(categoryKey), existingLocalAndGlobal);
        if (suggestions && suggestions.length > 0) {
            const normalizedExisting = existingLocalAndGlobal.map(normalizeStringForComparison);
            const filteredSuggestions = suggestions.filter(sugg => {
                const normalizedSugg = normalizeStringForComparison(sugg);
                if (normalizedSugg.length < 3) return false;
                if (typeof stringSimilarity === 'undefined') {
                    console.error("string-similarity library is not loaded.");
                    return true;
                }
                const bestMatch = stringSimilarity.findBestMatch(normalizedSugg, normalizedExisting);
                return bestMatch.bestMatch.rating < 0.80;
            });
            if (filteredSuggestions.length > 0) {
                if (!currentSuggestions[categoryKey]) {
                    currentSuggestions[categoryKey] = [];
                }
                currentSuggestions[categoryKey].push(...filteredSuggestions);
                totalFound += filteredSuggestions.length;
            }
        }
    }
    generateBtn.disabled = false;
    icon.classList.remove('spinning');
    textLabel.textContent = translations[currentLang].generateMoreSuggestions || 'Générer des suggestions';
    if(totalFound > 0) {
        renderSuggestions(currentSuggestions);
    } else {
        showToast('noNewSuggestionsFound', 'info');
    }
}
function renderSuggestions(suggestionsByCat) {
    let html = '';
    const sortedCategories = Object.keys(suggestionsByCat).sort((a,b) => getTranslatedCategoryName(a).localeCompare(getTranslatedCategoryName(b)));
    sortedCategories.forEach(categoryKey => {
        const categoryName = getTranslatedCategoryName(categoryKey, currentLang);
        const suggestions = suggestionsByCat[categoryKey];
        if (suggestions.length === 0) return;
        html += `
            <div class="suggestion-category-group" data-category-key="${categoryKey}">
                <div class="suggestion-category-title-wrapper">
                    <h4 class="suggestion-category-title">${translations[currentLang].suggestionsForCategory.replace('{categoryName}', categoryName)}</h4>
                    <button class="btn-add-all-category">${translations[currentLang].addAll || 'Tout Ajouter'}</button>
                </div>
                <ul class="suggestion-list">
        `;
        suggestions.sort((a, b) => a.localeCompare(b, currentLang)).forEach(name => {
            const relevanceClass = Math.random() > 0.6 ? 'popular' : 'ia';
            const relevanceText = relevanceClass === 'popular' ? 'Populaire' : 'Généré par IA';
            html += `
                <li class="suggestion-list-item" data-sujet-name="${name}">
                    <div class="suggestion-sujet-details">
                        <span class="suggestion-sujet-name">${name}</span>
                        <span class="suggestion-relevance-tag ${relevanceClass}">${relevanceText}</span>
                    </div>
                    <div class="suggestion-actions">
                        <button class="btn-suggestion-action add" title="${translations[currentLang].add || 'Ajouter'}">+</button>
                        <button class="btn-suggestion-action edit" title="${translations[currentLang].editButton || 'Modifier'}">✏️</button>
                        <button class="btn-suggestion-action reject" title="${translations[currentLang].reject || 'Rejeter'}">×</button>
                    </div>
                </li>
            `;
        });
        html += `</ul></div>`;
    });
    suggestionsListContainer.innerHTML = html;
    suggestionsListContainer.insertAdjacentHTML('beforeend', `
        <div class="ia-generation-container">
            <button id="btn-generate-ia" class="btn-generate-ia">
                <span class="icon" aria-hidden="true">✨</span>
                <span class="text-label">${translations[currentLang].generateMoreSuggestions || 'Générer des suggestions'}</span>
            </button>
        </div>
    `);
    attachSuggestionListeners();
}
function attachSuggestionListeners() {
    const container = document.getElementById('suggestions-list-container');
    if (!container) return;

    function addSuggestion(buttonElement) {
        const listItem = buttonElement.closest('.suggestion-list-item');
        const categoryGroup = listItem.closest('.suggestion-category-group');
        const categoryKey = categoryGroup.dataset.categoryKey;
        const sujetName = listItem.dataset.sujetName;

        const sujetKey = generateSujetKey(categoryKey, sujetName);
        const duplicateExists = sujetsDataGlobal.some(p => p.Key === sujetKey && (p.language || 'fr') === currentLang);
        if (duplicateExists) {
            showToast('sujetAlreadyExists', 'error');
            return;
        }

        const newSujet = {
            id: `sujet-${nextSujetId++}`,
            Key: sujetKey,
            name: sujetName,
            category: categoryKey,
            minrecommandedAge: undefined,
            maxrecommandedAge: undefined,
            language: currentLang,
            originalName_fr: (currentLang === 'fr' || !currentLang) ? sujetName : ""
        };
        sujetsDataGlobal.unshift(newSujet);
        dataHasBeenModified = true;
        suggestionsWereAdded = true;

        buttonElement.textContent = '✔';
        buttonElement.classList.add('added');
        buttonElement.disabled = true;
        const otherButtons = listItem.querySelectorAll('.btn-suggestion-action:not(.add)');
        otherButtons.forEach(btn => btn.disabled = true);
        showToast('sujetAdded', 'success');
    }

    function rejectSuggestion(buttonElement) {
        const listItem = buttonElement.closest('.suggestion-list-item');
        const categoryGroup = listItem.closest('.suggestion-category-group');
        const categoryKey = categoryGroup.dataset.categoryKey;
        const sujetName = listItem.dataset.sujetName;

        if (currentSuggestions[categoryKey]) {
            currentSuggestions[categoryKey] = currentSuggestions[categoryKey].filter(name => name !== sujetName);
        }
        listItem.classList.add('rejected');
        listItem.addEventListener('transitionend', () => {
            listItem.remove();
            if (categoryGroup.querySelectorAll('.suggestion-list-item').length === 0) {
                categoryGroup.remove();
            }
        });
    }

    container.querySelectorAll('.btn-add-all-category').forEach(btn => {
        btn.addEventListener('click', e => {
            const group = e.target.closest('.suggestion-category-group');
            group.querySelectorAll('.btn-suggestion-action.add:not(:disabled)').forEach(addBtn => addBtn.click());
        });
    });

    container.querySelectorAll('.btn-suggestion-action.add').forEach(btn => btn.addEventListener('click', e => addSuggestion(e.currentTarget)));
    container.querySelectorAll('.btn-suggestion-action.reject').forEach(btn => btn.addEventListener('click', e => rejectSuggestion(e.currentTarget)));
    container.querySelectorAll('.btn-suggestion-action.edit').forEach(btn => {
        btn.addEventListener('click', e => {
            const listItem = e.currentTarget.closest('.suggestion-list-item');
            const categoryGroup = listItem.closest('.suggestion-category-group');
            const sujetName = listItem.dataset.sujetName;
            const categoryKey = categoryGroup.dataset.categoryKey;
            closeSuggestionsModal();
            rejectSuggestion(e.currentTarget);
            setTimeout(() => {
                handleAddSujetClick({ name: sujetName, category: categoryKey });
            }, 350); 
        });
    });

    const generateBtn = container.querySelector('#btn-generate-ia');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAndDisplaySuggestions);
    }
}