import json
import re

RULES = {
    'food': ['restaurant', 'cafe', 'cloud_kitchen', 'bakery', 'juice_bar', 'tiffin', 'catering', 'ice_cream', 'street_food', 'pizza', 'biryani', 'mess', 'fruit_shop', 'dry_fruits', 'spice_shop', 'dhaba', 'fast_food', 'sweet_shop', 'ice_cream_parlour', 'tiffin_service', 'caterer', 'food_truck', 'paan_shop', 'chaat_stall'],
    'healthcare': ['clinic', 'hospital', 'dental', 'eye_clinic', 'pathology', 'pharmacy', 'physiotherapy', 'ayurveda', 'nursing_home', 'blood_bank', 'orthopedic', 'dermatology', 'pediatric', 'gynecology', 'psychiatry', 'homeopathy', 'ent', 'dietitian', 'skin_hair_clinic', 'infertility', 'obesity', 'sleep', 'allergy', 'rehab', 'veterinary', 'sexology', 'dental_clinic', 'ayurveda_clinic', 'homeopathy_clinic', 'lab_diagnostic', 'skin_clinic', 'orthopaedic', 'children_clinic', 'psychiatry_clinic', 'gynecology_clinic', 'rehabilitation_center', 'optician'],
    'beauty': ['men_salon', 'beauty_parlour', 'unisex_salon', 'spa', 'nail_studio', 'mehndi', 'tattoo', 'massage', 'acupuncture', 'makeup', 'bridal_studio', 'threading', 'eyebrow_studio', 'tattoo_studio', 'mehndi_artist', 'lash_studio', 'massage_center', 'laser_hair_removal', 'ayurvedic_spa'],
    'education': ['coaching', 'school', 'dance_academy', 'music_school', 'yoga', 'coding_bootcamp', 'art_classes', 'driving_school', 'cooking_class', 'english_class', 'nursery', 'home_tutor', 'library', 'sports_academy', 'dance_school', 'language_classes', 'computer_classes', 'neet_coaching', 'jee_coaching', 'upsc_coaching', 'spoken_english', 'chess_academy'],
    'fitness': ['gym', 'cricket_academy', 'sports_turf', 'swimming_pool', 'martial_arts', 'crossfit', 'gymnastics', 'badminton', 'yoga_studio', 'slimming_center', 'crossfit_gym', 'boxing_gym', 'dance_studio', 'cycling_studio', 'aerobics_center'],
    'retail': ['grocery', 'electronics', 'clothing', 'boutique', 'jewellery', 'furniture', 'mobile_shop', 'shoe_shop', 'toy_store', 'gift_shop', 'hardware', 'stationery', 'saree_shop', 'optician', 'watch', 'cosmetics', 'baby_care', 'musical_instruments', 'sports_shop', 'pet_shop', 'florist', 'aquarium', 'clothing_store', 'footwear_shop', 'jewelry_shop', 'electronics_store', 'grocery_store', 'hardware_store', 'stationery_shop', 'book_shop', 'furniture_shop', 'flower_shop', 'tailoring_shop', 'handicraft_shop', 'home_decor_store'],
    'home': ['electrician', 'plumber', 'carpenter', 'painter', 'ac_repair', 'ro_service', 'pest_control', 'laundry', 'home_cleaning', 'sofa_cleaning', 'cctv', 'solar_panel', 'appliance_repair', 'locksmith', 'tile_work', 'waterproofing', 'solar_panel_installer', 'water_purifier_service'],
    'transport': ['cab', 'auto_rickshaw', 'courier', 'car_garage', 'bike_workshop', 'car_rental', 'bike_rental', 'tyre_shop', 'car_wash', 'packers_movers', 'petrol_pump', 'truck_transport', 'school_van', 'taxi_service', 'travel_agency', 'ambulance_service', 'courier_service', 'towing_service'],
    'realestate': ['real_estate', 'property_dealer', 'civil_contractor', 'interior_designer', 'architect', 'pg_hostel', 'painting_contractor', 'tiles_shop', 'steel_dealer', 'cement_dealer', 'plywood', 'sand_supplier', 'false_ceiling', 'scaffolding', 'real_estate_agent', 'co_working_space'],
    'technology': ['software_agency', 'web_design', 'it_support', 'cyber_cafe', 'mobile_repair', 'cctv_security', 'data_recovery', 'game_dev', 'saas', 'digital_marketing', 'repair_shop', 'computer_repair', 'it_company', 'web_designer', 'digital_marketing_agency', 'cybercafe'],
    'finance': ['ca_firm', 'tax_consultant', 'loan_agent', 'insurance', 'stock_broker', 'lawyer', 'notary', 'money_lender', 'company_secretary', 'property_valuation', 'customs_broker', 'immigration', 'law_firm', 'insurance_agent', 'gst_consultant', 'company_registration', 'money_transfer'],
    'agriculture': ['kisan_store', 'dairy_farm', 'poultry', 'fish_farm', 'crop_manager', 'plant_nursery', 'honey_farm', 'rice_mill', 'seed_store', 'animal_feed', 'farm_shop'],
    'hospitality': ['hotel', 'guest_house', 'event_management', 'wedding_planner', 'banquet', 'tent_house', 'travel_agency', 'tour_operator', 'resort', 'dj_service', 'photography_studio', 'videography_studio', 'banquet_hall', 'wedding_venue', 'photography', 'event_planner'],
    'manufacturing': ['steel_fabrication', 'printing_press', 'packaging', 'rubber_stamp', 'textile', 'bamboo', 'paper_mart', 'plastic', 'food_processing', 'garment'],
    'specialized': ['security_agency', 'parking', 'society_rwa', 'cold_storage', 'warehouse', 'scrap_dealer', 'atm_maintenance', 'cable_tv', 'isp', 'gas_agency', 'water_tanker', 'borewell', 'stone_crusher', 'rmc_plant', 'labor_contractor', 'pet_care', 'other'],
    'digital': ['ecommerce', 'd2c_brand', 'dropshipping', 'news_portal', 'subscription_box', 'online_coaching', 'freelance_agency', 'influencer_management']
}

def get_category(business_id):
    for category, ids in RULES.items():
        if any(business_id == id_ or business_id.startswith(id_) for id_ in ids):
            return category
    return None

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the BUSINESS_CATEGORIES_INFO array
    array_start = content.find('export const BUSINESS_CATEGORIES_INFO: BusinessCategoryInfo[] = [')
    array_end = content.find('];', array_start) + 1
    if array_start == -1 or array_end == 0:
        return

    array_str = content[array_start:array_end+1]

    # Split into objects
    objects = []
    current_obj = ""
    brace_count = 0
    in_string = False
    escape = False

    for char in array_str:
        if escape:
            escape = False
        elif char == '\\':
            escape = True
        elif char == '"' or char == "'":
            in_string = not in_string
        elif not in_string:
            if char == '{':
                if brace_count == 0:
                    current_obj = ""
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    current_obj += char
                    objects.append(current_obj)
                    current_obj = ""
                    continue

        if brace_count > 0:
            current_obj += char

    # Process each object
    for i, obj in enumerate(objects):
        id_match = re.search(r'"id":\s*"([^"]+)"', obj)
        if id_match:
            business_id = id_match.group(1)
            new_cat = get_category(business_id)

            if new_cat:
                cat_match = re.search(r'"category":\s*"([^"]+)"', obj)
                if cat_match:
                    new_obj = obj[:cat_match.start()] + f'"category": "{new_cat}"' + obj[cat_match.end():]
                else:
                    insert_pos = obj.rfind('}')
                    # We will format it exactly like existing ones
                    new_obj = obj[:insert_pos] + f',\n    "category": "{new_cat}"\n  ' + obj[insert_pos:]

                # Replace the old object with the new object in the content
                content = content.replace(obj, new_obj)

    with open(filepath, 'w') as f:
        f.write(content)

if __name__ == '__main__':
    process_file('src/constants/businessRegistry.ts')
