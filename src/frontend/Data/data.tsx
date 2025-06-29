import { useState, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchWeather, fetchWeatherByCity, clearError } from '../../redux/weatherSlice'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { SidebarTrigger } from "../../components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Search, ChevronLeft, ChevronRight, Cloud } from "lucide-react"

export type WeatherData = {
  id: string;
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  feelsLike: number;
  visibility: number;
  lastUpdated: string;
};

// Default cities to fetch weather data for
const defaultCities = [
  "New York", "London", "Tokyo", "Sydney", "Paris", 
  "Berlin", "Mumbai", "Toronto", "Dubai", "Singapore", 
  "Los Angeles", "Chicago"
];

const ITEMS_PER_PAGE = 5

const countryMajorCities: Record<string, string[]> = {
  // East Asia
  CN: ["Shanghai", "Beijing", "Chongqing", "Tianjin", "Guangzhou", "Shenzhen", "Chengdu", "Nanjing", "Wuhan", "Xi'an"], // China
  JP: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Kobe", "Kyoto", "Fukuoka", "Kawasaki", "Saitama"], // Japan
  KR: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Seongnam"], // South Korea
  KP: ["Pyongyang", "Hamhung", "Nampo", "Hungnam", "Wonsan", "Chongjin", "Sinuiju", "Kaesong", "Haeju", "Kanggye"], // North Korea
  MN: ["Ulaanbaatar", "Erdenet", "Darkhan", "Choibalsan", "Khovd", "Ölgii", "Ulaangom", "Murun", "Sükhbaatar", "Dalanzadgad"], // Mongolia
  TW: ["Taipei", "New Taipei", "Kaohsiung", "Taichung", "Tainan", "Hsinchu", "Keelung", "Taoyuan", "Changhua", "Pingtung"], // Taiwan (Province of China)

  // Southeast Asia
  ID: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Depok", "Tangerang", "Bekasi"], // Indonesia
  TH: ["Bangkok", "Nonthaburi", "Nakhon Ratchasima", "Chiang Mai", "Hat Yai", "Udon Thani", "Pattaya", "Khon Kaen", "Phuket", "Surat Thani"], // Thailand
  VN: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Haiphong", "Can Tho", "Bien Hoa", "Hue", "Nha Trang", "Vung Tau", "Qui Nhon"], // Vietnam
  PH: ["Quezon City", "Manila", "Davao City", "Caloocan", "Cebu City", "Zamboanga City", "Taguig", "Pasig", "Antipolo", "Valenzuela"], // Philippines
  MY: ["Kuala Lumpur", "George Town", "Ipoh", "Petaling Jaya", "Shah Alam", "Johor Bahru", "Melaka", "Kota Kinabalu", "Kuching", "Seremban"], // Malaysia
  SG: ["Singapore", "Woodlands", "Bedok", "Tampines", "Jurong West", "Sengkang", "Hougang", "Yishun", "Ang Mo Kio", "Bukit Merah"], // Singapore
  MM: ["Yangon", "Mandalay", "Naypyidaw", "Mawlamyine", "Bago", "Pathein", "Monywa", "Sittwe", "Meiktila", "Taunggyi"], // Myanmar
  KH: ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Poipet", "Kampong Cham", "Kampong Speu", "Kampong Thom", "Pursat", "Takeo"], // Cambodia
  LA: ["Vientiane", "Pakse", "Savannakhet", "Luang Prabang", "Xam Neua", "Thakhek", "Phonsavan", "Vang Vieng", "Muang Xay", "Saravan"], // Laos
  BN: ["Bandar Seri Begawan", "Kuala Belait", "Seria", "Tutong", "Bangar", "Sukang", "Labu", "Sungai Liang", "Kampong Ayer", "Muara"], // Brunei
  TL: ["Dili", "Baucau", "Maliana", "Liquiçá", "Ermera", "Aileu", "Ainaro", "Manatuto", "Viqueque", "Same"], // Timor-Leste

  // South Asia
  IN: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Surat", "Jaipur"], // India
  PK: ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Hyderabad", "Peshawar", "Islamabad", "Quetta"], // Pakistan
  BD: ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", "Rangpur", "Comilla", "Narayanganj", "Mymensingh"], // Bangladesh
  NP: ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", "Birgunj", "Janakpur", "Hetauda", "Butwal", "Dharan"], // Nepal
  LK: ["Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Negombo", "Kandy", "Kalmunai", "Galle", "Jaffna", "Trincomalee", "Batticaloa"], // Sri Lanka
  BT: ["Thimphu", "Phuntsholing", "Paro", "Gelephu", "Samdrup Jongkhar", "Wangdue Phodrang", "Punakha", "Jakar", "Nganglam", "Samtse"], // Bhutan
  MV: ["Malé", "Addu City", "Fuvahmulah", "Kulhudhuffushi", "Thinadhoo", "Naifaru", "Hinnavaru", "Dhidhdhoo", "Viligili", "Eydhafushi"], // Maldives
  AF: ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif", "Jalalabad", "Kunduz", "Ghazni", "Balkh", "Baghlan", "Gardez"], // Afghanistan

  // Central Asia
  KZ: ["Almaty", "Nur-Sultan", "Shymkent", "Karaganda", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Semey", "Atyrau"], // Kazakhstan
  UZ: ["Tashkent", "Samarkand", "Namangan", "Andijan", "Bukhara", "Nukus", "Qarshi", "Fergana", "Jizzakh", "Urgench"], // Uzbekistan
  KG: ["Bishkek", "Osh", "Jalal-Abad", "Karakol", "Tokmok", "Uzgen", "Balykchy", "Naryn", "Talas", "Kyzyl-Kiya"], // Kyrgyzstan
  TJ: ["Dushanbe", "Khujand", "Kulob", "Bokhtar", "Istaravshan", "Vahdat", "Konibodom", "Tursunzoda", "Isfara", "Panjakent"], // Tajikistan
  TM: ["Ashgabat", "Türkmenabat", "Daşoguz", "Mary", "Balkanabat", "Bayramaly", "Türkmenbaşy", "Tejen", "Abadan", "Serdar"], // Turkmenistan

  // West Asia/Middle East
  TR: ["Istanbul", "Ankara", "Izmir", "Bursa", "Adana", "Gaziantep", "Konya", "Antalya", "Diyarbakır", "Mersin"], // Turkey
  IQ: ["Baghdad", "Basra", "Mosul", "Erbil", "Najaf", "Karbala", "Sulaymaniyah", "Nasiriyah", "Amara", "Kirkuk"], // Iraq
  IR: ["Tehran", "Mashhad", "Isfahan", "Karaj", "Tabriz", "Shiraz", "Qom", "Ahvaz", "Kermanshah", "Urmia"], // Iran
  SA: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Taif", "Tabuk", "Al Khobar", "Abha", "Najran"], // Saudi Arabia
  YE: ["Sana'a", "Aden", "Taiz", "Al Hudaydah", "Ibb", "Dhamar", "Al-Mukalla", "Sayyan", "Zinjibar", "Hajjah"], // Yemen
  SY: ["Damascus", "Aleppo", "Homs", "Hama", "Latakia", "Deir ez-Zor", "Raqqa", "Al-Hasakah", "Qamishli", "Tartus"], // Syria
  LB: ["Beirut", "Tripoli", "Sidon", "Tyre", "Byblos", "Zahle", "Nabatieh", "Jounieh", "Baalbek", "Batroun"], // Lebanon
  JO: ["Amman", "Zarqa", "Irbid", "Russeifa", "Al Quwaysimah", "Wadi as-Sir", "Tila al-Ali", "Karak", "Madaba", "Aqaba"], // Jordan
  IL: ["Jerusalem", "Tel Aviv", "Haifa", "Rishon LeZion", "Petah Tikva", "Ashdod", "Netanya", "Beersheba", "Holon", "Bnei Brak"], // Israel
  PS: ["Gaza City", "East Jerusalem", "Hebron", "Nablus", "Jenin", "Ramallah", "Jericho", "Tulkarm", "Qalqilya", "Bethlehem"], // Palestine
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Khor Fakkan", "Dibba Al-Fujairah"], // UAE
  OM: ["Muscat", "Seeb", "Salalah", "Bawshar", "Sohar", "Suwayq", "Ibri", "Saham", "Barka", "Rustaq"], // Oman
  QA: ["Doha", "Al Rayyan", "Umm Salal", "Al Wakrah", "Al Khor", "Dukhan", "Mesaieed", "Al Daayen", "Al Shamal", "Al Shahaniya"], // Qatar
  BH: ["Manama", "Riffa", "Muharraq", "Hamad Town", "A'ali", "Isa Town", "Sitra", "Budaiya", "Jidhafs", "Al-Malikiyah"], // Bahrain
  CY: ["Nicosia", "Limassol", "Larnaca", "Famagusta", "Paphos", "Kyrenia", "Protaras", "Morphou", "Aradippou", "Paralimni"], // Cyprus
  GE: ["Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Gori", "Zugdidi", "Poti", "Samtredia", "Khashuri", "Senaki"], // Georgia
  AM: ["Yerevan", "Gyumri", "Vanadzor", "Vagharshapat", "Abovyan", "Kapan", "Hrazdan", "Armavir", "Artashat", "Gavar"], // Armenia
  AZ: ["Baku", "Ganja", "Sumqayit", "Mingachevir", "Lankaran", "Shirvan", "Nakhchivan", "Shaki", "Yevlakh", "Khankendi"], // Azerbaijan
  
  // North America
  // United States (US)
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"],
  // Canada (CA)
  CA: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton","Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener"],
  // Mexico (MX)
  MX: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana","León", "Juárez", "Zapopan", "Monclova", "Chihuahua"],

  // Caribbean Countries
  CU: ["Havana", "Santiago de Cuba", "Camagüey", "Holguín", "Santa Clara","Guantánamo", "Bayamo", "Cienfuegos", "Pinar del Río", "Las Tunas"], // Cuba
  DO: ["Santo Domingo", "Santiago de los Caballeros", "Santo Domingo Este", "San Pedro de Macorís","La Romana", "Los Alcarrizos", "Puerto Plata", "San Cristóbal", "San Francisco de Macorís", "Concepción de La Vega"], // Dominican Republic
  HT: ["Port-au-Prince", "Carrefour", "Delmas", "Pétion-Ville", "Port-de-Paix","Gonaïves", "Saint-Marc", "Cap-Haïtien", "Les Cayes", "Verrettes"], // Haiti
  JM: ["Kingston", "New Kingston", "Spanish Town", "Portmore", "Montego Bay","Mandeville", "May Pen", "Old Harbour", "Linstead", "Half Way Tree"], // Jamaica
  PR: ["San Juan", "Bayamón", "Carolina", "Ponce", "Caguas", "Guaynabo", "Arecibo", "Toa Baja", "Mayagüez", "Trujillo Alto"], // Puerto Rico (US Territory)
  // Central America
  GT: ["Guatemala City", "Mixco", "Villa Nueva", "Quetzaltenango", "San Miguel Petapa","Escuintla", "San Juan Sacatepéquez", "Villa Canales", "Amatitlán", "Chimaltenango"], // Guatemala
  HN: ["Tegucigalpa", "San Pedro Sula", "Choloma", "La Ceiba", "El Progreso","Comayagua", "Choluteca", "Danlí", "Siguatepeque", "Juticalpa"], // Honduras
  SV: ["San Salvador", "Santa Ana", "Soyapango", "San Miguel", "Mejicanos","Santa Tecla", "Apopa", "Delgado", "Sonsonate", "San Marcos"], // El Salvador
  NI: ["Managua", "León", "Masaya", "Tipitapa", "Chinandega","Matagalpa", "Estelí", "Granada", "Ciudad Sandino", "Juigalpa"], // Nicaragua
  CR: ["San José", "Limón", "San Francisco", "Alajuela", "Liberia","Paraíso", "Desamparados", "Puntarenas", "Curridabat", "San Vicente"], // Costa Rica
  PA: ["Panama City", "San Miguelito", "Tocumen", "David", "Arraiján","Colón", "Las Cumbres", "La Chorrera", "Pacora", "Santiago de Veraguas"], // Panama
  // Other Territories & Dependencies
  BS: ["Nassau", "Freeport", "West End", "Coopers Town", "Marsh Harbour","Freetown", "Bahamas City", "Andros Town", "Clarence Town", "Dunmore Town"], // Bahamas
  BZ: ["Belize City", "San Ignacio", "Orange Walk", "Belmopan", "Dangriga","Corozal", "San Pedro", "Benque Viejo del Carmen", "Punta Gorda", "Ladyville"], // Belize
  // Smaller Caribbean Nations
  TT: ["Port of Spain", "San Fernando", "Chaguanas", "Arima", "Marabella","Point Fortin", "Tunapuna", "Scarborough", "Sangre Grande", "Princes Town"], // Trinidad & Tobago
  GD: ["St. George's", "Gouyave", "Grenville", "Victoria", "Sauteurs","Hillsborough", "Tivoli", "Grand Anse", "Lance aux Épines", "St. David's"], // Grenada
  LC: ["Castries", "Gros Islet", "Vieux Fort", "Micoud", "Soufrière","Dennery", "Anse La Raye", "Choiseul", "Laborie", "Canaries"], // Saint Lucia
  VC: ["Kingstown", "Georgetown", "Byera Village", "Barrouallie", "Chateaubelair","Layou", "Port Elizabeth", "Biabou", "Mesopotamia", "Calliaqua"], // Saint Vincent & the Grenadines
  AG: ["St. John's", "All Saints", "Liberta", "Potter's Village", "Bolans","Swetes", "Seaview Farm", "Piggotts", "Parham", "Carlisle"], // Antigua & Barbuda
  DM: ["Roseau", "Portsmouth", "Marigot", "Berekua", "Mahaut","Saint Joseph", "Wesley", "Soufrière", "Pont Cassé", "La Plaine"], // Dominica
  KN: ["Basseterre", "Sandy Point", "Mansion", "Dieppe Bay", "Cotton Ground","Monkey Hill", "Newcastle", "St. Paul's", "Nicola Town", "Charlestown"], // Saint Kitts & Nevis

  // Other Territories (Non-Sovereign)
  VI: ["Charlotte Amalie", "Cruz Bay", "Christiansted", "Frederiksted", "Anna's Retreat"], // US Virgin Islands
  KY: ["George Town", "West Bay", "Bodden Town", "East End", "North Side"], // Cayman Islands
  BM: ["Hamilton", "St. George's", "Somerset", "Flatts", "Devonshire"], // Bermuda
  AW: ["Oranjestad", "San Nicolaas", "Noord", "Santa Cruz", "Paradera"], // Aruba (Netherlands)
  CW: ["Willemstad", "Sint Michiel", "Barber", "Dorp Soto", "Nieuw Nederland"], // Curaçao (Netherlands)

  //Europe
  // Western Europe
  DE: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig"], // Germany
  FR: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Bordeaux", "Lille", "Rennes"], // France
  NL: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen"], // Netherlands
  BE: ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven", "Mons", "Aalst"], // Belgium
  LU: ["Luxembourg City", "Esch-sur-Alzette", "Differdange", "Dudelange", "Ettelbruck", "Diekirch", "Wiltz", "Rumelange", "Grevenmacher", "Remich"], // Luxembourg
  CH: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Winterthur", "Lucerne", "St. Gallen", "Lugano", "Biel/Bienne"], // Switzerland
  AT: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "Sankt Pölten", "Dornbirn"], // Austria
  LI: ["Vaduz", "Schaan", "Triesen", "Balzers", "Eschen", "Mauren", "Triesenberg", "Ruggell", "Gamprin", "Schellenberg"], // Liechtenstein
  MC: ["Monaco", "Monte Carlo", "La Condamine", "Fontvieille", "Moneghetti"], // Monaco

  // British Isles
  GB: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Glasgow", "Sheffield", "Bristol", "Leicester", "Edinburgh"], // United Kingdom
  IE: ["Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", "Swords", "Bray", "Navan"], // Ireland

  // Northern Europe
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping"], // Sweden
  DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde"], // Denmark
  NO: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand", "Tromsø", "Sandnes", "Sarpsborg"], // Norway
  FI: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti", "Kuopio", "Pori"], // Finland
  IS: ["Reykjavik", "Kópavogur", "Hafnarfjörður", "Akureyri", "Reykjanesbær", "Garðabær", "Mosfellsbær", "Árborg", "Akranes", "Fjarðabyggð"], // Iceland
  EE: ["Tallinn", "Tartu", "Narva", "Pärnu", "Kohtla-Järve", "Viljandi", "Rakvere", "Maardu", "Kuressaare", "Sillamäe"], // Estonia
  LV: ["Riga", "Daugavpils", "Liepāja", "Jelgava", "Jūrmala", "Ventspils", "Rēzekne", "Valmiera", "Ogre", "Tukums"], // Latvia
  LT: ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys", "Alytus", "Marijampolė", "Mažeikiai", "Jonava", "Utena"], // Lithuania

  // Southern Europe
  IT: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania"], // Italy
  ES: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao"], // Spain
  PT: ["Lisbon", "Porto", "Vila Nova de Gaia", "Amadora", "Braga", "Funchal", "Coimbra", "Setúbal", "Almada", "Agualva-Cacém"], // Portugal
  GR: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos", "Ioannina", "Trikala", "Chalcis", "Serres"], // Greece
  MT: ["Valletta", "Birkirkara", "Mosta", "Qormi", "Żabbar", "San Pawl il-Baħar", "Fgura", "Żejtun", "Sliema", "Hamrun"], // Malta
  SM: ["San Marino", "Borgo Maggiore", "Serravalle", "Domagnano", "Fiorentino", "Acquaviva", "Faetano", "Chiesanuova", "Montegiardino"], // San Marino
  VA: ["Vatican City"], // Vatican City

  // Eastern Europe
  PL: ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice"], // Poland
  CZ: ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec", "Olomouc", "Ústí nad Labem", "Hradec Králové", "České Budějovice", "Pardubice"], // Czech Republic
  SK: ["Bratislava", "Košice", "Prešov", "Žilina", "Banská Bystrica", "Nitra", "Trnava", "Trenčín", "Poprad", "Martin"], // Slovakia
  HU: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr", "Nyíregyháza", "Kecskemét", "Székesfehérvár", "Szombathely"], // Hungary
  RO: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov", "Galați", "Ploiești", "Oradea"], // Romania
  BG: ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen"], // Bulgaria
  RS: ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak", "Leskovac", "Smederevo"], // Serbia
  HR: ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Slavonski Brod", "Pula", "Karlovac", "Varaždin", "Šibenik"], // Croatia
  SI: ["Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper", "Novo Mesto", "Ptuj", "Trbovlje", "Kamnik"], // Slovenia
  BA: ["Sarajevo", "Banja Luka", "Tuzla", "Zenica", "Mostar", "Bijeljina", "Prijedor", "Brčko", "Doboj", "Cazin"], // Bosnia & Herzegovina
  ME: ["Podgorica", "Nikšić", "Pljevlja", "Bijelo Polje", "Cetinje", "Bar", "Herceg Novi", "Berane", "Budva", "Ulcinj"], // Montenegro
  MK: ["Skopje", "Bitola", "Kumanovo", "Prilep", "Tetovo", "Ohrid", "Veles", "Štip", "Strumica", "Kavadarci"], // North Macedonia
  AL: ["Tirana", "Durrës", "Vlorë", "Elbasan", "Shkodër", "Fier", "Korçë", "Berat", "Lushnjë", "Pogradec"], // Albania

  // Eastern Europe (Cont.)
  UA: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv", "Kryvyi Rih", "Mykolaiv", "Sevastopol"], // Ukraine
  BY: ["Minsk", "Gomel", "Mogilev", "Vitebsk", "Grodno", "Brest", "Babruysk", "Baranovichi", "Borisov", "Pinsk"], // Belarus
  MD: ["Chișinău", "Tiraspol", "Bălți", "Bender", "Rîbnița", "Ungheni", "Cahul", "Soroca", "Orhei", "Dubăsari"], // Moldova

  //Africa
  // Northern Africa
  DZ: ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Djelfa", "Sétif", "Sidi Bel Abbès", "Biskra"], // Algeria
  EG: ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said", "Suez", "Luxor", "Mansoura", "El-Mahalla El-Kubra", "Tanta"], // Egypt
  LY: ["Tripoli", "Benghazi", "Misrata", "Tarhuna", "Al Khums", "Zawiya", "Ajdabiya", "Sehba", "Tobruk", "Sabha"], // Libya
  MA: ["Casablanca", "Rabat", "Fes", "Tangier", "Marrakesh", "Salé", "Meknes", "Oujda", "Kenitra", "Agadir"], // Morocco
  SD: ["Khartoum", "Omdurman", "Port Sudan", "Kassala", "El Obeid", "Nyala", "Wad Madani", "Al Qadarif", "Kosti", "Al Fashir"], // Sudan
  TN: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "La Marsa"], // Tunisia
  SS: ["Juba", "Malakal", "Wau", "Yambio", "Aweil", "Bor", "Yei", "Rumbek", "Nimule", "Torit"], // South Sudan

  // Western Africa
  BJ: ["Cotonou", "Porto-Novo", "Parakou", "Djougou", "Bohicon", "Abomey-Calavi", "Natitingou", "Savé", "Abomey", "Kandi"], // Benin
  BF: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora", "Dédougou", "Kaya", "Tenkodogo", "Fada N'gourma", "Houndé"], // Burkina Faso
  CV: ["Praia", "Mindelo", "Santa Maria", "Assomada", "Porto Novo", "São Filipe", "Tarrafal", "Espargos", "Pedra Badejo", "Calheta"], // Cape Verde
  CI: ["Abidjan", "Bouaké", "Daloa", "San-Pédro", "Yamoussoukro", "Korhogo", "Man", "Divo", "Gagnoa", "Abengourou"], // Ivory Coast
  GM: ["Banjul", "Serekunda", "Brikama", "Bakau", "Farafenni", "Lamin", "Sukuta", "Basse Santa Su", "Gunjur", "Brufut"], // Gambia
  GH: ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Ashaiman", "Sunyani", "Cape Coast", "Obuasi", "Tema", "Madina"], // Ghana
  GN: ["Conakry", "Nzérékoré", "Kankan", "Kindia", "Labé", "Guéckédou", "Boké", "Mamou", "Faranah", "Siguiri"], // Guinea
  GW: ["Bissau", "Bafatá", "Gabú", "Bissorã", "Bolama", "Cacheu", "Catió", "Mansôa", "Buba", "Canchungo"], // Guinea-Bissau
  LR: ["Monrovia", "Gbarnga", "Kakata", "Bensonville", "Harper", "Voinjama", "Buchanan", "Zwedru", "Robertsport", "Greenville"], // Liberia
  ML: ["Bamako", "Sikasso", "Mopti", "Koutiala", "Ségou", "Gao", "Kayes", "Markala", "Kolondiéba", "Kati"], // Mali
  MR: ["Nouakchott", "Nouadhibou", "Rosso", "Adel Bagrou", "Kaédi", "Kiffa", "Zouérat", "Atar", "Sélibaby", "Aleg"], // Mauritania
  NE: ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua", "Arlit", "Dosso", "Birni-N'Konni", "Tessaoua", "Gaya"], // Niger
  NG: ["Lagos", "Kano", "Ibadan", "Abuja", "Port Harcourt", "Benin City", "Maiduguri", "Zaria", "Aba", "Jos"], // Nigeria
  SN: ["Dakar", "Touba", "Thiès", "Rufisque", "Kaolack", "M'bour", "Saint-Louis", "Ziguinchor", "Diourbel", "Tambacounda"], // Senegal
  SL: ["Freetown", "Bo", "Kenema", "Makeni", "Koidu", "Lunsar", "Port Loko", "Waterloo", "Kabala", "Segbwema"], // Sierra Leone
  TG: ["Lomé", "Sokodé", "Kara", "Atakpamé", "Kpalimé", "Dapaong", "Tsévié", "Aného", "Bassar", "Tchamba"], // Togo

  // Central Africa
  AO: ["Luanda", "Huambo", "Lobito", "Benguela", "Kuito", "Lubango", "Malanje", "Namibe", "Soyo", "Cabinda"], // Angola
  CM: ["Douala", "Yaoundé", "Bamenda", "Bafoussam", "Garoua", "Maroua", "Ngaoundéré", "Kumba", "Buea", "Limbe"], // Cameroon
  CF: ["Bangui", "Bimbo", "Berbérati", "Carnot", "Bambari", "Bouar", "Bossangoa", "Bria", "Bangassou", "Nola"], // Central African Republic
  TD: ["N'Djamena", "Moundou", "Sarh", "Abeche", "Kélo", "Koumra", "Pala", "Am Timan", "Bongor", "Mongo"], // Chad
  CG: ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Impfondo", "Ouesso", "Madingou", "Gamboma", "Owando", "Sibiti"], // Congo
  CD: ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kananga", "Kisangani", "Bukavu", "Tshikapa", "Kolwezi", "Likasi", "Goma"], // DR Congo
  GQ: ["Malabo", "Bata", "Ebebiyín", "Aconibe", "Añisoc", "Luba", "Evinayong", "Mongomo", "Mikomeseng", "Rebola"], // Equatorial Guinea
  GA: ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Mouila", "Lambaréné", "Tchibanga", "Koulamoutou", "Makokou"], // Gabon
  ST: ["São Tomé", "Santo António", "Neves", "Santana", "Trindade", "Guadalupe", "Santa Cruz", "Monte Café", "Angolares", "Ribeira Afonso"], // São Tomé and Príncipe

  // Eastern Africa
  BI: ["Bujumbura", "Gitega", "Muyinga", "Ngozi", "Ruyigi", "Kayanza", "Bururi", "Rutana", "Makamba", "Muramvya"], // Burundi
  KM: ["Moroni", "Mutsamudu", "Fomboni", "Domoni", "Tsimbeo", "Adda-Douéni", "Bambao", "Koni-Djodjo", "Moya", "Iconi"], // Comoros
  DJ: ["Djibouti City", "Ali Sabieh", "Tadjoura", "Obock", "Dikhil", "Arta", "Holhol", "Dorra", "Galafi", "Loyada"], // Djibouti
  ER: ["Asmara", "Keren", "Massawa", "Assab", "Mendefera", "Dekemhare", "Ak'ordat", "Adi Keyh", "Barentu", "Himbirti"], // Eritrea
  ET: ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Awasa", "Bahir Dar", "Jimma", "Dessie", "Jijiga", "Shashamane"], // Ethiopia
  KE: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Malindi", "Kitale", "Kakamega", "Nyeri", "Kericho"], // Kenya
  MG: ["Antananarivo", "Toamasina", "Antsirabe", "Fianarantsoa", "Mahajanga", "Toliara", "Antsiranana", "Ambovombe", "Amparafaravola", "Moramanga"], // Madagascar
  MW: ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu", "Mangochi", "Karonga", "Salima", "Nkhotakota", "Liwonde"], // Malawi
  MU: ["Port Louis", "Beau Bassin-Rose Hill", "Vacoas-Phoenix", "Curepipe", "Quatre Bornes", "Triolet", "Goodlands", "Centre de Flacq", "Bel Air Rivière Sèche", "Mahébourg"], // Mauritius
  MZ: ["Maputo", "Matola", "Beira", "Nampula", "Chimoio", "Nacala", "Quelimane", "Tete", "Xai-Xai", "Gurúè"], // Mozambique
  RW: ["Kigali", "Butare", "Gitarama", "Musanze", "Gisenyi", "Byumba", "Cyangugu", "Kibuye", "Rwamagana", "Nyagatare"], // Rwanda
  SC: ["Victoria", "Anse Boileau", "Beau Vallon", "Cascade", "Takamaka", "Port Glaud", "Anse Royale", "Baie Lazare", "Grand Anse", "La Digue"], // Seychelles
  SO: ["Mogadishu", "Hargeisa", "Bosaso", "Kismayo", "Berbera", "Marka", "Jawhar", "Baidoa", "Burao", "Garoowe"], // Somalia
  TZ: ["Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Mbeya", "Morogoro", "Tanga", "Kahama", "Zanzibar City", "Kigoma"], // Tanzania
  UG: ["Kampala", "Gulu", "Lira", "Mbarara", "Jinja", "Bwizibwera", "Mbale", "Mukono", "Kasese", "Masaka"], // Uganda
  ZM: ["Lusaka", "Kitwe", "Ndola", "Kabwe", "Chingola", "Mufulira", "Luanshya", "Livingstone", "Kasama", "Chipata"], // Zambia
  ZW: ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Kwekwe", "Kadoma", "Masvingo", "Chinhoyi", "Marondera"], // Zimbabwe

  // Southern Africa
  BW: ["Gaborone", "Francistown", "Molepolole", "Maun", "Serowe", "Kanye", "Mahalapye", "Mochudi", "Mogoditshane", "Palapye"], // Botswana
  LS: ["Maseru", "Teyateyaneng", "Mafeteng", "Hlotse", "Mohale's Hoek", "Maputsoe", "Qacha's Nek", "Quthing", "Butha-Buthe", "Mokhotlong"], // Lesotho
  NA: ["Windhoek", "Rundu", "Walvis Bay", "Oshakati", "Swakopmund", "Katima Mulilo", "Grootfontein", "Rehoboth", "Otjiwarongo", "Okahandja"], // Namibia
  ZA: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Pietermaritzburg", "Benoni", "Tembisa"], // South Africa
  SZ: ["Mbabane", "Manzini", "Big Bend", "Malkerns", "Nhlangano", "Siteki", "Piggs Peak", "Lobamba", "Hlatikulu", "Mhlume"], // Eswatini

  //South America
  // South America
  AR: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "San Miguel de Tucumán", "La Plata", "Mar del Plata", "Salta", "Santa Fe", "San Juan"], // Argentina  
  BO: ["La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre", "Oruro", "Tarija", "Potosí", "Sacaba", "Montero", "Quillacollo"], // Bolivia  
  BR: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre"], // Brazil  
  CL: ["Santiago", "Valparaíso", "Concepción", "Antofagasta", "Viña del Mar", "Temuco", "Rancagua", "Talca", "Arica", "Puerto Montt"], // Chile  
  CO: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira", "Santa Marta", "Ibagué"], // Colombia  
  EC: ["Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala", "Manta", "Portoviejo", "Loja", "Ambato", "Esmeraldas"], // Ecuador  
  FK: ["Stanley", "Goose Green", "Port Howard", "San Carlos", "Darwin", "Port Louis", "North Arm", "Hope Place", "Bluff Cove", "Chartres"], // Falkland Islands  
  GF: ["Cayenne", "Matoury", "Saint-Laurent-du-Maroni", "Kourou", "Remire-Montjoly", "Macouria", "Mana", "Apatou", "Grand-Santi", "Sinnamary"], // French Guiana  
  GY: ["Georgetown", "Linden", "New Amsterdam", "Bartica", "Skeldon", "Rosignol", "Mahaica Village", "Parika", "Lethem", "Vreed en Hoop"], // Guyana  
  PY: ["Asunción", "Ciudad del Este", "San Lorenzo", "Capiatá", "Lambaré", "Fernando de la Mora", "Encarnación", "Pedro Juan Caballero", "Itauguá", "Mariano Roque Alonso"], // Paraguay  
  PE: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco", "Huancayo", "Chimbote", "Pucallpa"], // Peru  
  SR: ["Paramaribo", "Lelydorp", "Nieuw Nickerie", "Moengo", "Nieuw Amsterdam", "Mariënburg", "Wageningen", "Albina", "Groningen", "Brownsweg"], // Suriname  
  UY: ["Montevideo", "Salto", "Ciudad de la Costa", "Paysandú", "Las Piedras", "Rivera", "Maldonado", "Tacuarembó", "Melo", "Mercedes"], // Uruguay  
  VE: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "Maturín", "Barcelona", "Turmero", "Petare"], // Venezuela  

  // Oceania
  // Oceania  
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart"], // Australia  
  FJ: ["Suva", "Lautoka", "Nadi", "Labasa", "Ba", "Levuka", "Sigatoka", "Savusavu", "Rakiraki", "Nausori"], // Fiji  
  KI: ["South Tarawa", "Betio", "Bikenibeu", "Teaoraereke", "Bairiki", "Eita", "Bonriki", "Temaiku", "Tabwakea", "Banaba"], // Kiribati  
  MH: ["Majuro", "Ebeye", "Arno", "Jaluit", "Kwajalein", "Wotje", "Kili", "Likiep", "Ailinglaplap", "Namdrik"], // Marshall Islands  
  FM: ["Palikir", "Weno", "Colonia", "Tofol", "Kolonia", "Tonoas", "Nema", "Lelu", "Malem", "Utwe"], // Micronesia  
  NR: ["Yaren", "Denigomodu", "Meneng", "Aiwo", "Anabar", "Anetan", "Boe", "Buada", "Ijuw", "Uaboe"], // Nauru  
  NZ: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier-Hastings", "Dunedin", "Palmerston North", "Nelson", "Rotorua"], // New Zealand  
  PW: ["Ngerulmud", "Koror", "Melekeok", "Airai", "Kloulklubed", "Ngermid", "Ngchemiangel", "Ngetkib", "Ngardmau", "Ulimang"], // Palau  
  PG: ["Port Moresby", "Lae", "Arawa", "Mount Hagen", "Popondetta", "Madang", "Kokopo", "Mendi", "Kimbe", "Goroka"], // Papua New Guinea  
  WS: ["Apia", "Vaitele", "Faleula", "Siusega", "Malie", "Vaiusu", "Leulumoega", "Fasito'outa", "Safotu", "Sataoa"], // Samoa  
  SB: ["Honiara", "Auki", "Gizo", "Buala", "Tulagi", "Kirakira", "Lata", "Taro", "Tigoa", "Noropo"], // Solomon Islands  
  TO: ["Nukuʻalofa", "Neiafu", "Haveluloto", "Vaini", "Pangai", "'Ohonua", "Hihifo", "Kolovai", "Nukunuku", "Tofoa"], // Tonga  
  TV: ["Funafuti", "Vaiaku", "Fongafale", "Alapi", "Senala", "Fakaifou", "Lofeagai", "Teone", "Tekavatoetoe", "Tepuka"], // Tuvalu  
  VU: ["Port Vila", "Luganville", "Norsup", "Sola", "Lakatoro", "Isangel", "Port-Olry", "Ambryn", "Longana", "Saratamata"],  // Vanuatu  
};

export function data() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: weatherData, loading, error } = useSelector((state: RootState) => state.weather);
  const selectedCountry = useSelector((state: RootState) => state.weather.selectedCountry);
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchedWeather, setSearchedWeather] = useState<WeatherData | null>(null)

  // Determine which cities to fetch
  const majorCities = selectedCountry && countryMajorCities[selectedCountry]
    ? countryMajorCities[selectedCountry]
    : defaultCities;

  // Fetch weather data for the selected country's major cities (only when not in search mode)
  useEffect(() => {
    if (majorCities && majorCities.length > 0 && !isSearchMode) {
      dispatch(fetchWeather(majorCities));
    }
  }, [dispatch, selectedCountry, majorCities, isSearchMode]);

  // Convert API weather data to our format
  const convertedWeatherData: WeatherData[] = useMemo(() => {
    return weatherData.map((apiWeather, index) => ({
      id: (index + 1).toString(),
      city: apiWeather.name,
      temperature: Math.round(apiWeather.main.temp),
      condition: apiWeather.weather[0]?.description || "unknown",
      humidity: apiWeather.main.humidity,
      windSpeed: Math.round(apiWeather.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: "N", // API doesn't provide direction, using default
      feelsLike: Math.round(apiWeather.main.feels_like),
      visibility: 10, // API doesn't provide visibility in basic plan
      lastUpdated: new Date().toISOString(),
    }));
  }, [weatherData]);

  // Dynamic search handler
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    dispatch(clearError()); // clear error on new input

    if (!value.trim()) {
      setIsSearchMode(false);
      setSearchedWeather(null);
      return;
    }

    // Check if the input matches any city in the current table
    const match = convertedWeatherData.find((weather) =>
      weather.city.toLowerCase().includes(value.trim().toLowerCase())
    );

    if (match) {
      setIsSearchMode(false);
      setSearchedWeather(null);
    } else {
      setIsSearchMode(true);
      dispatch(fetchWeatherByCity(value.trim()));
    }
  };

  // Update searched weather when API data is available in search mode
  useEffect(() => {
    if (isSearchMode && weatherData.length > 0 && weatherData[0]) {
      const apiWeather = weatherData[0];
      setSearchedWeather({
        id: "1",
        city: apiWeather.name,
        temperature: Math.round(apiWeather.main.temp),
        condition: apiWeather.weather[0]?.description || "unknown",
        humidity: apiWeather.main.humidity,
        windSpeed: Math.round(apiWeather.wind.speed * 3.6),
        windDirection: "N",
        feelsLike: Math.round(apiWeather.main.feels_like),
        visibility: 10,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [weatherData, isSearchMode]);

  // Determine which data to display and filter
  const displayData = useMemo(() => {
    if (isSearchMode && searchedWeather) {
      // In search mode, show only the searched result
      return [searchedWeather];
    } else if (isSearchMode && !searchedWeather) {
      // In search mode but no result yet
      return [];
    } else {
      // In normal mode, filter the table data
      return convertedWeatherData.filter((weather) => 
        weather.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [isSearchMode, searchedWeather, convertedWeatherData, searchTerm]);

  const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = displayData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen weather-gradient-blue weather-bg">
      <header className="flex items-center gap-2 px-4 py-3 md:px-6">
        <SidebarTrigger className="md:hidden text-blue-700" />
        <h1 className="text-xl font-semibold text-blue-900">Weather Data</h1>
      </header>

      <div className="px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="glass text-blue-900 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                Weather Data Table
                {loading && <span className="text-sm text-blue-600">(Loading...)</span>}
              </CardTitle>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-4 w-4" />
                <Input
                  placeholder="Type city name to search dynamically..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="pl-10 glass text-blue-900 placeholder:text-blue-600 border-blue-300 focus:border-blue-500"
                />
              </div>
              {error && displayData.length === 0 && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
              {isSearchMode && searchedWeather && (
                <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                  Showing weather data for: {searchedWeather.city}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200 hover:bg-blue-50">
                      <TableHead className="text-blue-800 font-semibold">City</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Temperature</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Condition</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Humidity</TableHead>
                      <TableHead className="text-blue-800 font-semibold">Wind Speed</TableHead>
                      <TableHead className="hidden md:table-cell text-blue-800 font-semibold">Feels Like</TableHead>
                      <TableHead className="hidden lg:table-cell text-blue-800 font-semibold">Visibility</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                            Loading weather data...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-blue-600">
                          {isSearchMode 
                            ? 'No weather data found for this location. Try searching for a different city.' 
                            : searchTerm 
                              ? 'No cities found matching your search.' 
                              : 'No weather data available.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((weather) => (
                        <TableRow key={weather.id} className="border-blue-100 hover:bg-blue-50">
                          <TableCell className="font-medium text-blue-900">{weather.city}</TableCell>
                          <TableCell className="text-blue-800">{weather.temperature}°C</TableCell>
                          <TableCell className="capitalize text-blue-700">{weather.condition}</TableCell>
                          <TableCell className="text-blue-700">{weather.humidity}%</TableCell>
                          <TableCell className="text-blue-700">{weather.windSpeed} km/h</TableCell>
                          <TableCell className="hidden md:table-cell text-blue-700">{weather.feelsLike}°C</TableCell>
                          <TableCell className="hidden lg:table-cell text-blue-700">{weather.visibility} km</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination - Only show when not in search mode and there are multiple results */}
              {!loading && !isSearchMode && displayData.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-blue-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, displayData.length)} of{" "}
                    {displayData.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="text-blue-700 border-blue-300 hover:bg-blue-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === page
                              ? "bg-blue-500 text-white border-blue-500"
                              : "text-blue-700 border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="text-blue-700 border-blue-300 hover:bg-blue-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default data;