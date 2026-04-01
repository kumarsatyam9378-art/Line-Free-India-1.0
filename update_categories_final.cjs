const fs = require('fs');
const content = fs.readFileSync('src/constants/businessRegistry.ts', 'utf8');

const CATEGORY_MAP = {
  // Food & Restaurant
  'restaurant': 'food', 'cafe': 'food', 'cloud_kitchen': 'food', 'bakery': 'food', 'juice_bar': 'food', 'tiffin_service': 'food',
  'catering': 'food', 'ice_cream': 'food', 'street_food': 'food', 'pizza_shop': 'food', 'biryani_house': 'food',
  'mess_canteen': 'food', 'fruit_shop': 'food', 'dry_fruits': 'food', 'spice_shop': 'food', 'sweet_shop': 'food',
  'dhaba': 'food', 'fast_food': 'food', 'food_truck': 'food', 'tea_stall': 'food', 'meat_shop': 'food',

  // Healthcare
  'clinic': 'healthcare', 'hospital': 'healthcare', 'dental_clinic': 'healthcare', 'eye_clinic': 'healthcare', 'pathology_lab': 'healthcare',
  'pharmacy': 'healthcare', 'physiotherapy': 'healthcare', 'ayurveda': 'healthcare', 'nursing_home': 'healthcare', 'blood_bank': 'healthcare',
  'orthopedic': 'healthcare', 'dermatology': 'healthcare', 'pediatric': 'healthcare', 'gynecology': 'healthcare', 'psychiatry': 'healthcare',
  'homeopathy': 'healthcare', 'ent_clinic': 'healthcare', 'dietitian': 'healthcare', 'veterinary': 'healthcare',
  'skin_hair_clinic': 'healthcare', 'sexology_clinic': 'healthcare', 'infertility_clinic': 'healthcare', 'weight_loss_clinic': 'healthcare',
  'sleep_clinic': 'healthcare', 'allergy_clinic': 'healthcare', 'rehab_center': 'healthcare', 'veterinary_clinic': 'healthcare',
  'medical_store': 'healthcare', 'diagnostic_center': 'healthcare', 'maternity_home': 'healthcare', 'optical_store': 'healthcare',

  // Beauty & Wellness
  'men_salon': 'beauty', 'beauty_parlour': 'beauty', 'unisex_salon': 'beauty', 'spa': 'beauty', 'nail_studio': 'beauty',
  'mehndi_artist': 'beauty', 'tattoo_studio': 'beauty', 'massage_center': 'beauty', 'acupuncture': 'beauty',
  'makeup_artist': 'beauty', 'bridal_studio': 'beauty', 'threading_waxing': 'beauty', 'hair_transplant': 'beauty',
  'barber': 'beauty', 'massage': 'beauty',

  // Education
  'coaching_institute': 'education', 'school': 'education', 'dance_academy': 'education', 'music_school': 'education',
  'yoga_studio': 'education', 'coding_bootcamp': 'education', 'art_classes': 'education', 'driving_school': 'education',
  'cooking_class': 'education', 'english_class': 'education', 'nursery': 'education', 'home_tutor': 'education', 'library': 'education',
  'sports_academy': 'education', 'college': 'education', 'play_school': 'education', 'computer_institute': 'education',
  'language_classes': 'education', 'tuition_center': 'education',

  // Fitness
  'gym': 'fitness', 'cricket_academy': 'fitness', 'sports_turf': 'fitness', 'swimming_pool': 'fitness', 'martial_arts': 'fitness',
  'crossfit': 'fitness', 'gymnastics': 'fitness', 'badminton_court': 'fitness', 'fitness_center': 'fitness', 'zumba_classes': 'fitness',

  // Retail
  'grocery': 'retail', 'electronics_shop': 'retail', 'clothing': 'retail', 'boutique': 'retail', 'jewellery': 'retail',
  'furniture': 'retail', 'mobile_shop': 'retail', 'shoe_shop': 'retail', 'toy_store': 'retail', 'gift_shop': 'retail',
  'hardware': 'retail', 'stationery': 'retail', 'saree_shop': 'retail', 'optician': 'retail', 'watch_showroom': 'retail',
  'cosmetics': 'retail', 'baby_care': 'retail', 'musical_instruments': 'retail', 'sports_shop': 'retail',
  'pet_shop': 'retail', 'florist': 'retail', 'aquarium': 'retail', 'kirana_store': 'retail', 'supermarket': 'retail',
  'medical_equipment': 'retail', 'book_store': 'retail', 'bags_shop': 'retail', 'utensils_shop': 'retail',
  'electronics': 'retail', 'mobile_accessories': 'retail', 'garments': 'retail', 'footwear': 'retail',

  // Home Services
  'electrician': 'home', 'plumber': 'home', 'carpenter': 'home', 'painter': 'home', 'ac_repair': 'home', 'ro_service': 'home',
  'pest_control': 'home', 'laundry': 'home', 'home_cleaning': 'home', 'sofa_cleaning': 'home', 'cctv_installation': 'home',
  'solar_panel': 'home', 'appliance_repair': 'home', 'locksmith': 'home', 'tile_work': 'home', 'waterproofing': 'home',
  'dry_cleaner': 'home', 'tailor': 'home', 'gas_stove_repair': 'home', 'inverter_battery': 'home',

  // Transport
  'cab_service': 'transport', 'auto_rickshaw': 'transport', 'courier': 'transport', 'car_garage': 'transport', 'bike_workshop': 'transport',
  'car_rental': 'transport', 'bike_rental': 'transport', 'tyre_shop': 'transport', 'car_wash': 'transport',
  'packers_movers': 'transport', 'petrol_pump': 'transport', 'truck_transport': 'transport', 'school_van': 'transport',
  'tours_travels': 'transport', 'transport_contractor': 'transport', 'ambulance': 'transport', 'car_accessories': 'transport',

  // Real Estate
  'real_estate': 'realestate', 'property_dealer': 'realestate', 'civil_contractor': 'realestate', 'interior_designer': 'realestate',
  'architect': 'realestate', 'pg_hostel': 'realestate', 'painting_contractor': 'realestate', 'tiles_shop': 'realestate', 'steel_dealer': 'realestate',
  'cement_dealer': 'realestate', 'plywood_hardware': 'realestate', 'sand_supplier': 'realestate', 'false_ceiling': 'realestate',
  'scaffolding': 'realestate', 'builders': 'realestate', 'sanitary_ware': 'realestate', 'glass_dealers': 'realestate',

  // Technology
  'software_agency': 'technology', 'web_design': 'technology', 'it_support': 'technology', 'cyber_cafe': 'technology', 'mobile_repair': 'technology',
  'cctv_security': 'technology', 'data_recovery': 'technology', 'game_dev': 'technology', 'saas_company': 'technology', 'digital_marketing': 'technology',
  'computer_repair': 'technology', 'csc_center': 'technology',

  // Finance & Legal
  'ca_firm': 'finance', 'tax_consultant': 'finance', 'loan_agent': 'finance', 'insurance_agency': 'finance', 'stock_broker': 'finance',
  'lawyer': 'finance', 'notary': 'finance', 'money_lender': 'finance', 'company_secretary': 'finance', 'property_valuation': 'finance',
  'customs_broker': 'finance', 'immigration_consultant': 'finance', 'advocate': 'finance', 'mutual_fund_agent': 'finance',

  // Agriculture
  'kisan_store': 'agriculture', 'dairy_farm': 'agriculture', 'poultry_farm': 'agriculture', 'fish_farm': 'agriculture', 'crop_manager': 'agriculture',
  'plant_nursery': 'agriculture', 'honey_farm': 'agriculture', 'rice_mill': 'agriculture', 'seed_store': 'agriculture', 'animal_feed': 'agriculture',
  'tractor_dealer': 'agriculture', 'fertilizer_shop': 'agriculture', 'agro_chemicals': 'agriculture',

  // Hospitality
  'hotel': 'hospitality', 'guest_house': 'hospitality', 'event_management': 'hospitality', 'wedding_planner': 'hospitality', 'banquet': 'hospitality',
  'tent_house': 'hospitality', 'travel_agency': 'hospitality', 'tour_operator': 'hospitality', 'resort': 'hospitality', 'dj_service': 'hospitality',
  'photography_studio': 'hospitality', 'videography_studio': 'hospitality', 'pg_accommodation': 'hospitality', 'lodge': 'hospitality',
  'caterer': 'hospitality', 'photo_studio': 'hospitality', 'decor_lighting': 'hospitality',

  // Manufacturing
  'steel_fabrication': 'manufacturing', 'printing_press': 'manufacturing', 'packaging': 'manufacturing', 'rubber_stamp': 'manufacturing',
  'textile_weaving': 'manufacturing', 'bamboo_products': 'manufacturing', 'paper_mart': 'manufacturing', 'plastic_products': 'manufacturing',
  'food_processing': 'manufacturing', 'garment_manufacturer': 'manufacturing', 'furniture_maker': 'manufacturing',

  // Specialized
  'security_agency': 'specialized', 'parking': 'specialized', 'society_rwa': 'specialized', 'cold_storage': 'specialized', 'warehouse': 'specialized',
  'scrap_dealer': 'specialized', 'atm_maintenance': 'specialized', 'cable_tv': 'specialized', 'isp': 'specialized', 'gas_agency': 'specialized',
  'water_tanker': 'specialized', 'borewell': 'specialized', 'stone_crusher': 'specialized', 'rmc_plant': 'specialized', 'labor_contractor': 'specialized',
  'astrologer': 'specialized', 'purohit': 'specialized', 'maid_agency': 'specialized', 'tailoring_materials': 'specialized',
  'religious_items': 'specialized', 'other': 'specialized', 'other_business': 'specialized', 'laundry_dryclean': 'home',

  // Digital
  'ecommerce_store': 'digital', 'd2c_brand': 'digital', 'dropshipping': 'digital', 'news_portal': 'digital', 'subscription_box': 'digital',
  'online_coaching': 'digital', 'freelance_agency': 'digital', 'influencer_management': 'digital'
};

const lines = content.split('\n');
let modifiedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const idMatch = line.match(/^    "id": "([^"]+)",?$/);

  if (idMatch) {
    const id = idMatch[1];
    modifiedLines.push(line);

    // Look ahead one line to see if there's an original category
    let nextLineHasCategory = false;
    if (i + 1 < lines.length && lines[i + 1].match(/^    "category": "([^"]+)",?$/)) {
      nextLineHasCategory = true;
    }

    if (!nextLineHasCategory) {
      let category = CATEGORY_MAP[id] || 'specialized';
      modifiedLines.push(`    "category": "${category}",`);
    } else {
      // It has a category line, but let's check if it maps to our valid set or is something else
      const origCat = lines[i + 1].match(/^    "category": "([^"]+)",?$/)[1];
      let category = CATEGORY_MAP[id];
      if (!category) {
        if (origCat === 'home_services') category = 'home';
        else if (origCat === 'tech_&_it') category = 'technology';
        else if (origCat === 'finance_&_legal') category = 'finance';
        else if (origCat === 'real_estate') category = 'realestate';
        else if (origCat === 'special/misc') category = 'specialized';
        else category = origCat;
      }
      modifiedLines.push(`    "category": "${category}",`);
      // Skip the next line
      i++;
    }
  } else {
    modifiedLines.push(line);
  }
}

fs.writeFileSync('src/constants/businessRegistry.ts', modifiedLines.join('\n'));
