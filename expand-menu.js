import fs from 'fs';
import path from 'path';

// Helper to quickly create items
function createItems(cuisine, category, itemsDef) {
  return itemsDef.map(i => ({
    id: i[0],
    name: i[1],
    category: category,
    price: i[2],
    description: i[3],
    ingredients: i[4],
    calories: i[5],
    emoji: i[6],
    tags: i[7],
    pairs_with: i[8],
    image: `images/dishes/${i[0]}.jpg`,
    cuisine: cuisine,
    dietary: i[9],
    wikiPage: i[10] // Used for downloading image
  }));
}

const newItems = [
  ...createItems('South India', 'pasta-mains', [
    ['masala-dosa', 'Authentic Masala Dosa', 9.5, 'Crispy fermented rice & lentil crepe filled with spiced potato masala, served with coconut chutney and sambar.', ['Rice', 'Urad Dal', 'Potato', 'Mustard Seeds', 'Curry Leaves'], 350, '🥞', ['popular', 'vegetarian'], ['filter-coffee', 'payasam'], 'veg', 'Dosa'],
    ['idli-sambar', 'Steamed Idli & Sambar', 7.5, 'Soft, fluffy steamed rice cakes served with a hearty lentil and vegetable stew.', ['Rice', 'Lentils', 'Vegetables', 'Tamarind'], 250, '☁️', ['healthy', 'vegetarian'], ['filter-coffee'], 'veg', 'Idli'],
    ['medu-vada', 'Crispy Medu Vada', 6.5, 'Deep-fried savory lentil doughnuts, crispy on the outside and soft inside.', ['Urad Dal', 'Green Chilies', 'Ginger', 'Pepper'], 300, '🍩', ['vegetarian'], ['masala-dosa'], 'veg', 'Medu_vada'],
    ['uttapam', 'Onion Tomato Uttapam', 8.5, 'Thick savory pancake topped with finely chopped onions, tomatoes, and cilantro.', ['Rice', 'Lentils', 'Onions', 'Tomatoes'], 320, '🥘', ['vegetarian'], ['filter-coffee'], 'veg', 'Uttapam'],
    ['hyderabadi-biryani', 'Hyderabadi Chicken Biryani', 16.5, 'Aromatic basmati rice layered with marinated chicken, saffron, and caramelized onions, slow-cooked to perfection.', ['Basmati Rice', 'Chicken', 'Yogurt', 'Saffron', 'Spices'], 750, '🍲', ['popular', 'spicy'], ['royal-mango-lassi'], 'non-veg', 'Hyderabadi_biryani'],
    ['chettinad-chicken', 'Chicken Chettinad', 15.5, 'Fiery and intensely spiced chicken curry from Tamil Nadu, made with roasted coconut and ground spices.', ['Chicken', 'Coconut', 'Fennel Seeds', 'Black Pepper'], 600, '🍛', ['spicy'], ['masala-dosa'], 'non-veg', 'Chettinad_cuisine'],
    ['kerala-fish-curry', 'Kerala Meen Curry', 18.5, 'Spicy and tangy fish curry cooked in coconut milk and kokum (cambodge).', ['King Fish', 'Coconut Milk', 'Kokum', 'Spices'], 450, '🐟', ['seafood'], ['idli-sambar'], 'non-veg', 'Malabar_matthi_curry'],
    ['ven-pongal', 'Ghee Ven Pongal', 8.5, 'Comforting South Indian porridge made with rice, yellow lentils, black pepper, and tempered with rich ghee.', ['Rice', 'Moong Dal', 'Ghee', 'Cashews', 'Black Pepper'], 400, '🍚', ['comfort', 'vegetarian'], ['medu-vada'], 'veg', 'Pongal_(dish)'],
    ['bisi-bele-bath', 'Bisi Bele Bath', 10.5, 'A spicy, tangy, and wholesome rice and lentil dish from Karnataka with mixed vegetables.', ['Rice', 'Toor Dal', 'Tamarind', 'Vegetables', 'Ghee'], 450, '🍛', ['vegetarian', 'spicy'], ['masala-dosa'], 'veg', 'Bisi_Bele_Bath'],
    ['appam-stew', 'Appam with Veg Stew', 11.5, 'Lacy, soft hoppers made from fermented rice batter, served with mild coconut milk vegetable stew.', ['Rice Flour', 'Coconut Milk', 'Mixed Veggies', 'Cardamom'], 320, '🥞', ['vegetarian', 'healthy'], ['kerala-fish-curry'], 'veg', 'Appam'],
  ]),
  ...createItems('South India', 'teas-infusions', [
    ['filter-coffee', 'Madras Filter Coffee', 4.5, 'Strong, frothy South Indian coffee brewed with chicory and mixed with boiling hot milk.', ['Coffee Beans', 'Chicory', 'Milk', 'Sugar'], 120, '☕', ['popular'], ['masala-dosa', 'medu-vada'], 'veg', 'Indian_filter_coffee'],
  ]),
  ...createItems('South India', 'desserts', [
    ['payasam', 'Kerala Palada Payasam', 6.5, 'Rich and creamy milk pudding with rice flakes, flavored with cardamom and garnished with cashews.', ['Milk', 'Rice Flakes', 'Sugar', 'Cardamom', 'Cashews'], 350, '🍨', ['sweet'], ['hyderabadi-biryani'], 'veg', 'Kheer'],
    ['mysore-pak', 'Mysore Pak', 5.5, 'Melt-in-your-mouth sweet from Karnataka made with generous amounts of ghee, sugar, and gram flour.', ['Gram Flour', 'Ghee', 'Sugar'], 400, '🥮', ['sweet'], ['filter-coffee'], 'veg', 'Mysore_pak'],
  ]),

  ...createItems('North India', 'pasta-mains', [
    ['palak-paneer', 'Palak Paneer', 13.5, 'Cottage cheese cubes simmered in a smooth, creamy, and spiced spinach gravy.', ['Spinach', 'Paneer', 'Garlic', 'Cream'], 450, '🥬', ['vegetarian'], ['garlic-naan'], 'veg', 'Palak_paneer'],
    ['chole-bhature', 'Chole Bhature', 12.5, 'Spicy chickpea curry served with large, fluffy deep-fried bread. A Punjabi classic.', ['Chickpeas', 'Spices', 'Maida (Flour)'], 600, '🥙', ['popular', 'vegetarian'], ['royal-mango-lassi'], 'veg', 'Chole_bhature'],
    ['rogan-josh', 'Kashmiri Rogan Josh', 18.5, 'Aromatic lamb curry cooked with Kashmiri chilies, fennel, and yogurt.', ['Lamb', 'Yogurt', 'Kashmiri Chili', 'Fennel'], 700, '🍖', ['spicy', 'meat'], ['garlic-naan'], 'non-veg', 'Rogan_josh'],
    ['dal-makhani', 'Dal Makhani', 11.5, 'Whole black lentils and kidney beans slow-cooked for 24 hours with butter and cream.', ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream'], 500, '🥣', ['vegetarian', 'comfort'], ['garlic-naan'], 'veg', 'Dal_makhani'],
    ['malai-kofta', 'Malai Kofta', 14.5, 'Deep-fried potato and paneer dumplings in a rich, creamy, slightly sweet cashew-tomato gravy.', ['Paneer', 'Potato', 'Cashews', 'Cream'], 550, '🥘', ['vegetarian', 'sweet'], ['garlic-naan'], 'veg', 'Malai_kofta'],
  ]),
  ...createItems('North India', 'starters-small-plates', [
    ['samosa-chaat', 'Samosa Chaat', 8.5, 'Crushed crispy samosas topped with spicy chickpea curry, yogurt, mint, and tamarind chutney.', ['Potatoes', 'Chickpeas', 'Yogurt', 'Chutneys'], 400, '🥟', ['vegetarian'], ['royal-masala-chai'], 'veg', 'Samosa'],
    ['garlic-naan', 'Butter Garlic Naan', 4.5, 'Soft and pillowy Indian flatbread topped with minced garlic and butter, baked in a tandoor.', ['Flour', 'Garlic', 'Butter', 'Yeast'], 250, '🫓', ['vegetarian'], ['butter-chicken', 'palak-paneer'], 'veg', 'Naan'],
  ]),

  ...createItems('Thailand', 'pasta-mains', [
    ['pad-thai', 'Authentic Pad Thai', 14.5, 'Stir-fried rice noodles with eggs, peanuts, bean sprouts, and a tangy tamarind sauce.', ['Rice Noodle', 'Shrimp', 'Peanuts', 'Tamarind', 'Egg'], 550, '🍜', ['popular'], ['thai-iced-tea'], 'non-veg', 'Pad_thai'],
    ['tom-yum', 'Tom Yum Goong', 15.5, 'Hot and sour Thai soup with shrimp, lemongrass, galangal, kaffir lime leaves, and fresh chilies.', ['Shrimp', 'Lemongrass', 'Lime Leaves', 'Chili'], 300, '🥣', ['spicy', 'seafood'], ['pad-thai'], 'non-veg', 'Tom_yum'],
    ['green-curry', 'Thai Green Curry', 16.5, 'Aromatic and spicy coconut milk curry with chicken, bamboo shoots, and Thai basil.', ['Chicken', 'Coconut Milk', 'Green Curry Paste', 'Basil'], 600, '🍲', ['spicy'], ['mango-sticky-rice'], 'non-veg', 'Green_curry'],
    ['massaman-curry', 'Massaman Beef Curry', 18.5, 'Rich, relatively mild Thai curry with beef, potatoes, peanuts, and warming spices.', ['Beef', 'Potatoes', 'Peanuts', 'Coconut Milk'], 750, '🍛', ['comfort'], ['thai-iced-tea'], 'non-veg', 'Massaman_curry'],
  ]),
  ...createItems('Thailand', 'starters-small-plates', [
    ['som-tum', 'Som Tum (Papaya Salad)', 9.5, 'Spicy, crunchy, and tangy green papaya salad with peanuts, tomatoes, and lime-chili dressing.', ['Green Papaya', 'Peanuts', 'Lime', 'Chili'], 150, '🥗', ['healthy', 'spicy'], ['pad-thai'], 'non-veg', 'Green_papaya_salad'],
  ]),
  ...createItems('Thailand', 'desserts', [
    ['mango-sticky-rice', 'Mango Sticky Rice', 8.5, 'Sweet sticky rice drizzled with rich coconut cream, served with fresh ripe mango slices.', ['Sticky Rice', 'Mango', 'Coconut Milk', 'Sugar'], 450, '🥭', ['sweet', 'vegetarian'], ['thai-iced-tea'], 'veg', 'Mango_sticky_rice'],
  ]),
  ...createItems('Thailand', 'specialty-beverages', [
    ['thai-iced-tea', 'Thai Iced Tea', 5.5, 'Strongly-brewed black tea spiced with star anise and poured over ice with sweetened condensed milk.', ['Black Tea', 'Star Anise', 'Condensed Milk'], 220, '🧋', ['sweet'], ['pad-thai'], 'veg', 'Thai_tea'],
  ]),

  ...createItems('China', 'pasta-mains', [
    ['peking-duck', 'Peking Duck', 28.5, 'Famous Beijing dish featuring crispy-skinned roasted duck, served with pancakes, scallions, and hoisin sauce.', ['Duck', 'Hoisin Sauce', 'Pancakes', 'Scallions'], 900, '🦆', ['premium'], ['jasmine-tea'], 'non-veg', 'Peking_duck'],
    ['mapo-tofu', 'Mapo Tofu', 14.5, 'Soft tofu set in a spicy, numbing, bright red chili-and-bean-based sauce, often with minced pork.', ['Tofu', 'Minced Pork', 'Sichuan Peppercorns', 'Chili Paste'], 450, '🥘', ['spicy'], ['jasmine-tea'], 'non-veg', 'Mapo_tofu'],
    ['kung-pao-chicken', 'Kung Pao Chicken', 15.5, 'Spicy, stir-fried Chinese dish made with cubes of chicken, peanuts, vegetables, and chili peppers.', ['Chicken', 'Peanuts', 'Chili Peppers', 'Soy Sauce'], 550, '🐔', ['spicy'], ['spring-rolls'], 'non-veg', 'Kung_Pao_chicken'],
    ['dim-sum-platter', 'Assorted Dim Sum', 16.5, 'A selection of traditional steamed dumplings including Har Gow (shrimp) and Siu Mai (pork).', ['Shrimp', 'Pork', 'Wheat Starch', 'Bamboo Shoots'], 400, '🥟', ['popular'], ['jasmine-tea'], 'non-veg', 'Dim_sum'],
    ['chow-mein', 'Cantonese Chow Mein', 13.5, 'Stir-fried noodles with crisp vegetables and a savory soy-oyster sauce.', ['Noodles', 'Vegetables', 'Soy Sauce', 'Oyster Sauce'], 480, '🍜', ['vegetarian'], ['spring-rolls'], 'veg', 'Chow_mein'],
  ]),
  ...createItems('China', 'starters-small-plates', [
    ['spring-rolls', 'Crispy Spring Rolls', 7.5, 'Shatteringly crisp rolls filled with shredded cabbage, carrots, and glass noodles. Served with sweet chili sauce.', ['Cabbage', 'Carrots', 'Glass Noodles', 'Spring Roll Wrapper'], 300, '🥢', ['vegetarian'], ['kung-pao-chicken'], 'veg', 'Spring_roll'],
  ]),
  ...createItems('China', 'teas-infusions', [
    ['jasmine-tea', 'Jasmine Pearls Tea', 4.5, 'Premium green tea leaves hand-rolled into pearls and scented with fresh jasmine blossoms.', ['Green Tea', 'Jasmine Blossoms'], 2, '🍵', ['healthy'], ['dim-sum-platter'], 'veg', 'Jasmine_tea'],
  ]),
  
  ...createItems('Japan', 'pasta-mains', [
    ['sushi-platter', 'Omakase Sushi Platter', 32.5, 'Chef’s selection of premium Nigiri and Maki rolls, featuring Bluefin tuna, salmon, and yellowtail.', ['Rice', 'Tuna', 'Salmon', 'Seaweed', 'Wasabi'], 600, '🍣', ['seafood', 'premium'], ['japanese-matcha-ceremony'], 'non-veg', 'Sushi'],
    ['sashimi-moriawase', 'Sashimi Moriawase', 38.5, 'An exquisite assortment of the freshest, thick-cut raw fish and seafood.', ['Tuna', 'Salmon', 'Yellowtail', 'Scallops'], 350, '🍱', ['seafood', 'healthy'], ['miso-soup'], 'non-veg', 'Sashimi'],
    ['chicken-teriyaki', 'Chicken Teriyaki', 16.5, 'Grilled chicken glazed with a sweet and savory soy-mirin sauce, served with steamed rice.', ['Chicken', 'Soy Sauce', 'Mirin', 'Sugar'], 550, '🍗', ['popular'], ['miso-soup'], 'non-veg', 'Teriyaki'],
    ['tempura-udon', 'Shrimp Tempura Udon', 15.5, 'Thick, chewy wheat noodles in a savory dashi broth, topped with crispy shrimp tempura.', ['Udon Noodles', 'Shrimp', 'Dashi', 'Soy Sauce'], 450, '🍜', ['seafood'], ['matcha-mochi'], 'non-veg', 'Udon'],
    ['gyudon', 'Gyudon (Beef Bowl)', 14.5, 'Thinly sliced beef and onions simmered in a mildly sweet soy-dashi broth, served over rice.', ['Beef', 'Onions', 'Rice', 'Dashi'], 650, '🍛', ['comfort'], ['miso-soup'], 'non-veg', 'Gyudon'],
  ]),
  ...createItems('Japan', 'starters-small-plates', [
    ['miso-soup', 'Traditional Miso Soup', 4.5, 'Comforting soup made with dashi stock and fermented soybean paste, with tofu and wakame.', ['Miso Paste', 'Dashi', 'Tofu', 'Wakame'], 80, '🥣', ['healthy'], ['sushi-platter'], 'non-veg', 'Miso_soup'],
  ]),
  ...createItems('Japan', 'desserts', [
    ['matcha-mochi', 'Matcha Daifuku Mochi', 6.5, 'Soft, chewy glutinous rice cake stuffed with sweet red bean paste and matcha cream.', ['Mochiko', 'Red Bean Paste', 'Matcha', 'Sugar'], 200, '🍡', ['sweet', 'vegetarian'], ['japanese-matcha-ceremony'], 'veg', 'Mochi'],
  ]),

  ...createItems('Vietnam', 'pasta-mains', [
    ['pho-bo', 'Pho Bo (Beef Noodle Soup)', 15.5, 'Fragrant, slow-simmered beef bone broth with flat rice noodles, topped with thinly sliced beef and fresh herbs.', ['Beef Broth', 'Rice Noodles', 'Beef slices', 'Basil', 'Star Anise'], 450, '🍜', ['popular', 'comfort'], ['vietnamese-iced-coffee'], 'non-veg', 'Pho'],
    ['banh-mi', 'Classic Banh Mi', 11.5, 'Crusty French baguette loaded with pate, roast pork, pickled daikon, carrots, cucumber, and cilantro.', ['Baguette', 'Pork', 'Pate', 'Pickled Veggies', 'Cilantro'], 550, '🥖', ['popular'], ['vietnamese-iced-coffee'], 'non-veg', 'B%C3%A1nh_m%C3%AC'],
    ['bun-cha', 'Bun Cha Hanoi', 14.5, 'Grilled pork and pork meatballs served in a sweet/savory broth with rice vermicelli and fresh greens.', ['Pork', 'Vermicelli', 'Fish Sauce', 'Herbs'], 600, '🍲', ['meat'], ['fresh-spring-rolls'], 'non-veg', 'Bun_cha'],
  ]),
  ...createItems('Vietnam', 'starters-small-plates', [
    ['fresh-spring-rolls', 'Goi Cuon (Summer Rolls)', 8.5, 'Fresh rice paper rolls packed with shrimp, herbs, pork, and rice vermicelli, served with peanut sauce.', ['Rice Paper', 'Shrimp', 'Pork', 'Herbs'], 220, '🌯', ['healthy'], ['pho-bo'], 'non-veg', 'G%E1%BB%8Fi_cu%E1%BB%91n'],
  ]),

  ...createItems('Mexico', 'pasta-mains', [
    ['chicken-fajitas', 'Sizzling Chicken Fajitas', 17.5, 'Grilled marinated chicken strips with bell peppers and onions, served with warm tortillas and salsa.', ['Chicken', 'Bell Peppers', 'Onions', 'Tortillas'], 650, '🍳', ['popular'], ['guacamole-chips'], 'non-veg', 'Fajita'],
    ['beef-enchiladas', 'Beef Enchiladas', 16.5, 'Corn tortillas rolled around seasoned beef, smothered in rich red chili sauce and baked with cheese.', ['Beef', 'Tortillas', 'Chili Sauce', 'Cheese'], 700, '🌯', ['spicy', 'meat'], ['mexican-horchata'], 'non-veg', 'Enchilada'],
    ['chiles-rellenos', 'Chiles Rellenos', 15.5, 'Roasted poblano peppers stuffed with cheese, dipped in an egg batter, and fried until golden.', ['Poblano Peppers', 'Cheese', 'Egg', 'Tomato Sauce'], 450, '🌶️', ['vegetarian'], ['tacos-al-pastor'], 'veg', 'Chile_relleno'],
    ['quesadilla', 'Grilled Chicken Quesadilla', 12.5, 'Large flour tortilla filled with melted cheese and grilled chicken, served with pico de gallo and sour cream.', ['Tortilla', 'Cheese', 'Chicken', 'Sour Cream'], 600, '🧀', ['popular'], ['guacamole-chips'], 'non-veg', 'Quesadilla'],
  ]),
  ...createItems('Mexico', 'starters-small-plates', [
    ['guacamole-chips', 'Fresh Guacamole & Chips', 9.5, 'House-made guacamole with ripe Hass avocados, lime, jalapeño, and cilantro, served with crisp tortilla chips.', ['Avocado', 'Tortilla Chips', 'Lime', 'Cilantro'], 400, '🥑', ['vegetarian'], ['chicken-fajitas'], 'veg', 'Guacamole'],
  ]),

  ...createItems('Italy', 'pasta-mains', [
    ['lasagna', 'Lasagna al Forno', 18.5, 'Layers of flat pasta baked with rich beef bolognese sauce, béchamel, and Parmigiano-Reggiano.', ['Pasta', 'Beef', 'Tomato Sauce', 'Cheese', 'Béchamel'], 800, '🍝', ['comfort', 'meat'], ['tiramisu'], 'non-veg', 'Lasagne'],
    ['ossobuco', 'Ossobuco alla Milanese', 32.5, 'Cross-cut veal shanks braised with vegetables, white wine, and broth. Traditionally served with gremolata.', ['Veal', 'Wine', 'Broth', 'Vegetables'], 750, '🍖', ['premium', 'meat'], ['panna-cotta'], 'non-veg', 'Ossobuco'],
    ['ravioli', 'Spinach & Ricotta Ravioli', 17.5, 'Handmade pasta pillows filled with fresh spinach and ricotta cheese, tossed in brown butter and sage.', ['Pasta', 'Spinach', 'Ricotta', 'Butter', 'Sage'], 500, '🥟', ['vegetarian'], ['tiramisu'], 'veg', 'Ravioli'],
  ]),
  ...createItems('Italy', 'desserts', [
    ['panna-cotta', 'Vanilla Panna Cotta', 10.5, 'Silky, sweetened cream thickened with gelatin and molded, served with a wild berry compote.', ['Cream', 'Sugar', 'Vanilla', 'Gelatin', 'Berries'], 350, '🍮', ['sweet', 'vegetarian'], ['espresso'], 'veg', 'Panna_cotta'],
  ]),

  ...createItems('France', 'pasta-mains', [
    ['coq-au-vin', 'Coq au Vin', 24.5, 'Classic French dish of chicken braised with wine, mushrooms, garlic, and pearl onions.', ['Chicken', 'Red Wine', 'Mushrooms', 'Bacon'], 650, '🍗', ['comfort', 'meat'], ['creme-brulee'], 'non-veg', 'Coq_au_vin'],
    ['ratatouille', 'Ratatouille Niçoise', 18.5, 'A colorful and deeply flavorful stewed vegetable dish native to Provence.', ['Eggplant', 'Zucchini', 'Bell Peppers', 'Tomatoes'], 200, '🍆', ['vegetarian', 'healthy'], ['french-onion-soup'], 'veg', 'Ratatouille'],
    ['beef-bourguignon', 'Beef Bourguignon', 28.5, 'Beef stew braised in red wine and beef broth, flavored with carrots, onions, garlic, and bouquet garni.', ['Beef', 'Red Wine', 'Carrots', 'Mushrooms'], 750, '🍲', ['premium', 'meat'], ['creme-brulee'], 'non-veg', 'Beef_bourguignon'],
    ['bouillabaisse', 'Bouillabaisse', 34.5, 'Traditional Provençal fish stew originating from Marseille, loaded with fresh seafood and saffron.', ['Fish', 'Shellfish', 'Saffron', 'Tomatoes'], 500, '🦞', ['seafood', 'premium'], ['french-macarons'], 'non-veg', 'Bouillabaisse'],
  ]),
  ...createItems('France', 'starters-small-plates', [
    ['escargot', 'Escargots de Bourgogne', 16.5, 'Snails cooked in a rich, garlicky, herby butter, served in their shells.', ['Snails', 'Butter', 'Garlic', 'Parsley'], 250, '🐌', ['premium'], ['beef-bourguignon'], 'non-veg', 'Escargot'],
  ]),
  ...createItems('France', 'desserts', [
    ['crepes-suzette', 'Crêpes Suzette', 14.5, 'Thin French pancakes served in a sauce of caramelized sugar and butter, tangerine juice, and Grand Marnier, flambéed.', ['Flour', 'Butter', 'Sugar', 'Grand Marnier'], 450, '🥞', ['sweet', 'vegetarian'], ['espresso'], 'veg', 'Cr%C3%AApes_Suzette'],
  ]),

  ...createItems('Spain', 'pasta-mains', [
    ['paella-valenciana', 'Paella Valenciana', 26.5, 'Iconic Spanish rice dish cooked in a wide pan with saffron, chicken, rabbit, and green beans.', ['Bomba Rice', 'Chicken', 'Saffron', 'Green Beans'], 700, '🥘', ['popular', 'meat'], ['gazpacho'], 'non-veg', 'Paella'],
    ['seafood-paella', 'Paella de Marisco', 29.5, 'A stunning coastal version of Paella, packed with shrimp, mussels, clams, and calamari.', ['Bomba Rice', 'Shrimp', 'Mussels', 'Saffron'], 650, '🦐', ['seafood', 'premium'], ['patatas-bravas'], 'non-veg', 'Paella'],
  ]),
  ...createItems('Spain', 'starters-small-plates', [
    ['patatas-bravas', 'Patatas Bravas', 8.5, 'Crispy fried potato cubes served with a spicy, smoky tomato sauce and garlic aioli.', ['Potatoes', 'Olive Oil', 'Paprika', 'Aioli'], 350, '🥔', ['vegetarian'], ['paella-valenciana'], 'veg', 'Patatas_bravas'],
    ['gazpacho', 'Andalusian Gazpacho', 9.5, 'A refreshing, chilled tomato-based soup blended with cucumbers, peppers, olive oil, and garlic.', ['Tomatoes', 'Cucumber', 'Bell Pepper', 'Olive Oil'], 120, '🍅', ['healthy', 'vegetarian'], ['seafood-paella'], 'veg', 'Gazpacho'],
    ['tortilla-espanola', 'Tortilla Española', 10.5, 'Classic Spanish omelette made with eggs, thinly sliced potatoes, and onions, cooked in olive oil.', ['Eggs', 'Potatoes', 'Onions', 'Olive Oil'], 400, '🍳', ['vegetarian'], ['patatas-bravas'], 'veg', 'Spanish_omelette'],
    ['jamon-iberico', 'Jamón Ibérico', 22.5, 'Premium cured ham from free-range black Iberian pigs, sliced paper-thin.', ['Acorn-fed Pork Ham'], 300, '🥓', ['premium', 'meat'], ['paella-valenciana'], 'non-veg', 'Jam%C3%B3n_ib%C3%A9rico'],
  ]),

  ...createItems('Lebanon', 'pasta-mains', [
    ['falafel-wrap', 'Authentic Falafel Wrap', 12.5, 'Crispy chickpea fritters wrapped in flatbread with fresh herbs, pickles, and tahini sauce.', ['Chickpeas', 'Tahini', 'Pita', 'Pickles'], 550, '🧆', ['vegetarian', 'popular'], ['hummus-pita'], 'veg', 'Falafel'],
  ]),
  ...createItems('Lebanon', 'starters-small-plates', [
    ['baba-ganoush', 'Baba Ganoush', 8.5, 'Smoky, roasted eggplant dip blended with tahini, lemon juice, and garlic, served with pita.', ['Eggplant', 'Tahini', 'Lemon', 'Pita'], 250, '🍆', ['vegetarian', 'healthy'], ['chicken-shawarma-platter'], 'veg', 'Baba_ghanoush'],
    ['tabbouleh', 'Tabbouleh Salad', 9.5, 'A vibrant, fresh herb salad primarily of finely chopped parsley, mint, tomatoes, and bulgur.', ['Parsley', 'Bulgur', 'Tomatoes', 'Lemon Juice'], 150, '🥗', ['healthy', 'vegetarian'], ['falafel-wrap'], 'veg', 'Tabbouleh'],
    ['fattoush', 'Fattoush', 10.5, 'A Levantine bread salad made from toasted or fried pieces of khubz (Arab flatbread) combined with mixed greens.', ['Mixed Greens', 'Pita Bread', 'Sumac', 'Radish'], 200, '🥗', ['healthy', 'vegetarian'], ['chicken-shawarma-platter'], 'veg', 'Fattoush'],
  ]),

  ...createItems('Greece', 'pasta-mains', [
    ['moussaka', 'Traditional Moussaka', 19.5, 'Baked casserole layered with eggplant, minced lamb in tomato sauce, and topped with a thick béchamel sauce.', ['Eggplant', 'Lamb', 'Béchamel', 'Tomatoes'], 650, '🍆', ['comfort', 'meat'], ['greek-salad'], 'non-veg', 'Moussaka'],
    ['souvlaki', 'Chicken Souvlaki', 16.5, 'Marinated and grilled chicken skewers served with tzatziki, pita bread, and a side of fries.', ['Chicken', 'Pita', 'Tzatziki', 'Olive Oil'], 550, '🍢', ['popular'], ['greek-salad'], 'non-veg', 'Souvlaki'],
    ['gyro', 'Lamb Gyro', 14.5, 'Thinly sliced, highly seasoned roasted lamb wrapped in a pita with tomato, onion, and tzatziki.', ['Lamb', 'Pita', 'Tzatziki', 'Onion'], 600, '🥙', ['popular', 'meat'], ['greek-salad'], 'non-veg', 'Gyro_(food)'],
  ]),
  ...createItems('Greece', 'starters-small-plates', [
    ['spanakopita', 'Spanakopita', 11.5, 'Savory Greek pie made of perfectly flaky phyllo dough filled with spinach and feta cheese.', ['Phyllo Dough', 'Spinach', 'Feta Cheese', 'Onions'], 350, '🥧', ['vegetarian'], ['moussaka'], 'veg', 'Spanakopita'],
    ['greek-salad', 'Horiatiki (Greek Salad)', 12.5, 'Rustic salad of tomatoes, cucumbers, onion, feta cheese, and Kalamata olives, dressed with olive oil.', ['Tomatoes', 'Feta', 'Olives', 'Olive Oil'], 250, '🥗', ['healthy', 'vegetarian'], ['moussaka'], 'veg', 'Greek_salad'],
  ]),

  ...createItems('USA', 'pasta-mains', [
    ['bbq-ribs', 'BBQ Pork Ribs', 26.5, 'Slow-smoked, fall-off-the-bone baby back ribs generously glazed in a tangy, sweet BBQ sauce.', ['Pork Ribs', 'BBQ Sauce', 'Spices'], 900, '🍖', ['meat', 'comfort'], ['buffalo-wings'], 'non-veg', 'Pork_ribs'],
    ['mac-cheese', 'Truffle Mac & Cheese', 15.5, 'Ultra-creamy macaroni pasta baked with a blend of sharp cheddar, gruyere, and a hint of truffle oil.', ['Macaroni', 'Cheddar', 'Gruyere', 'Truffle Oil'], 750, '🧀', ['comfort', 'vegetarian'], ['bbq-ribs'], 'veg', 'Macaroni_and_cheese'],
  ]),
  ...createItems('USA', 'starters-small-plates', [
    ['clam-chowder', 'New England Clam Chowder', 12.5, 'Rich, thick soup made with clams, potatoes, onions, and cream, served in a sourdough bread bowl.', ['Clams', 'Potatoes', 'Cream', 'Bacon'], 450, '🍲', ['seafood', 'comfort'], ['lobster-roll'], 'non-veg', 'Clam_chowder'],
  ]),

  ...createItems('UK', 'pasta-mains', [
    ['fish-and-chips', 'Classic Fish and Chips', 19.5, 'Crispy beer-battered cod served with thick-cut chips, mushy peas, and tartar sauce.', ['Cod', 'Potatoes', 'Beer Batter', 'Peas'], 800, '🍟', ['seafood', 'popular'], ['earl-grey'], 'non-veg', 'Fish_and_chips'],
    ['beef-wellington', 'Beef Wellington', 36.5, 'Premium beef tenderloin coated with pâté and duxelles, wrapped in puff pastry, and baked.', ['Beef Tenderloin', 'Puff Pastry', 'Mushrooms', 'Prosciutto'], 900, '🥩', ['premium', 'meat'], ['original-cheesecake'], 'non-veg', 'Beef_Wellington'],
    ['shepherds-pie', 'Shepherd\'s Pie', 18.5, 'Comforting savory dish of minced lamb topped with a thick layer of creamy, browned mashed potato.', ['Lamb', 'Potatoes', 'Carrots', 'Peas'], 650, '🥧', ['comfort', 'meat'], ['earl-grey'], 'non-veg', 'Shepherd\'s_pie'],
    ['english-breakfast', 'Full English Breakfast', 16.5, 'A hearty plate featuring bacon, sausages, eggs, baked beans, mushrooms, tomatoes, and toast.', ['Eggs', 'Bacon', 'Sausage', 'Beans', 'Toast'], 950, '🍳', ['comfort', 'meat'], ['london-fog'], 'non-veg', 'Full_breakfast'],
  ]),

  ...createItems('Germany', 'pasta-mains', [
    ['bratwurst', 'Grilled Bratwurst', 15.5, 'Traditional German pork sausage, grilled and served with sauerkraut, mustard, and warm potato salad.', ['Pork Sausage', 'Sauerkraut', 'Mustard', 'Potatoes'], 700, '🌭', ['meat'], ['black-forest-cake'], 'non-veg', 'Bratwurst'],
    ['schnitzel', 'Wiener Schnitzel', 21.5, 'A very thin, breaded, and pan-fried veal cutlet, served with lemon wedges and parsley potatoes.', ['Veal', 'Breadcrumbs', 'Lemon', 'Potatoes'], 650, '🥩', ['meat', 'popular'], ['black-forest-cake'], 'non-veg', 'Schnitzel'],
  ]),
  ...createItems('Germany', 'starters-small-plates', [
    ['pretzels', 'Bavarian Pretzels', 7.5, 'Large, soft, and chewy baked pretzels sprinkled with coarse salt, served with a warm beer cheese dip.', ['Flour', 'Yeast', 'Salt', 'Cheese'], 350, '🥨', ['vegetarian'], ['bratwurst'], 'veg', 'Pretzel'],
  ]),
  ...createItems('Germany', 'desserts', [
    ['black-forest-cake', 'Black Forest Gateau', 9.5, 'Rich chocolate sponge cake layered with whipped cream, sour cherries, and a splash of Kirsch.', ['Chocolate', 'Cherries', 'Cream', 'Kirsch'], 450, '🍰', ['sweet', 'vegetarian'], ['espresso'], 'veg', 'Black_Forest_gateau'],
  ]),

  ...createItems('Brazil', 'pasta-mains', [
    ['feijoada', 'Brazilian Feijoada', 22.5, 'A deeply savory, slow-cooked black bean stew with various cuts of pork and beef, served with rice and farofa.', ['Black Beans', 'Pork', 'Beef', 'Farofa'], 850, '🍲', ['comfort', 'meat'], ['pao-de-queijo'], 'non-veg', 'Feijoada'],
    ['picanha', 'Churrasco Picanha', 28.5, 'The prized Brazilian cut of beef (sirloin cap), seasoned simply with rock salt and grilled over an open flame.', ['Beef Picanha', 'Rock Salt'], 750, '🥩', ['premium', 'meat'], ['feijoada'], 'non-veg', 'Picanha'],
  ]),
  ...createItems('Brazil', 'starters-small-plates', [
    ['pao-de-queijo', 'Pão de Queijo', 8.5, 'Naturally gluten-free, chewy, and gooey Brazilian cheese breads made from cassava flour.', ['Cassava Flour', 'Cheese', 'Milk', 'Eggs'], 300, '🧀', ['vegetarian'], ['feijoada'], 'veg', 'P%C3%A3o_de_queijo'],
  ]),

  ...createItems('Peru', 'starters-small-plates', [
    ['ceviche', 'Peruvian Ceviche', 17.5, 'Fresh, raw white fish cured in bright citrus juices, spiced with ají, and mixed with sliced onions and cilantro.', ['White Fish', 'Lime', 'Red Onion', 'Cilantro', 'Ají'], 250, '🐟', ['seafood', 'healthy'], ['lomo-saltado'], 'non-veg', 'Ceviche'],
  ]),
  ...createItems('Peru', 'pasta-mains', [
    ['lomo-saltado', 'Lomo Saltado', 21.5, 'A popular, traditional Peruvian stir-fry combining marinated strips of beef steak with onions, tomatoes, and french fries.', ['Beef', 'Tomatoes', 'Onions', 'Fries', 'Soy Sauce'], 700, '🥩', ['popular', 'meat'], ['ceviche'], 'non-veg', 'Lomo_saltado'],
  ]),

  ...createItems('Ethiopia', 'pasta-mains', [
    ['doro-wat', 'Doro Wat (Spicy Chicken Stew)', 18.5, 'A rich, spicy Ethiopian chicken stew slow-cooked with berbere spice blend, served with a hard-boiled egg.', ['Chicken', 'Berbere', 'Onions', 'Eggs'], 650, '🍲', ['spicy', 'meat'], ['injera'], 'non-veg', 'Wat_(food)'],
    ['injera', 'Injera & Veggie Platter', 16.5, 'Slightly spongy, sour flatbread made of teff flour, served with a colorful array of spiced lentil and vegetable stews.', ['Teff Flour', 'Lentils', 'Cabbage', 'Split Peas'], 500, '🥞', ['vegetarian', 'healthy'], ['doro-wat'], 'veg', 'Injera'],
  ]),

  ...createItems('Argentina', 'pasta-mains', [
    ['asado', 'Argentinian Asado (Mixed Grill)', 38.5, 'A monumental platter of wood-fire grilled beef ribs, flank steak, chorizo, and morcilla, served with chimichurri.', ['Beef Ribs', 'Steak', 'Chorizo', 'Chimichurri'], 1200, '🔥', ['premium', 'meat'], ['empanadas'], 'non-veg', 'Asado'],
  ]),
  ...createItems('Argentina', 'starters-small-plates', [
    ['empanadas', 'Beef Empanadas', 11.5, 'Baked savory pastries filled with seasoned ground beef, onions, olives, and hard-boiled eggs.', ['Flour', 'Beef', 'Onions', 'Olives'], 400, '🥟', ['meat'], ['asado'], 'non-veg', 'Empanada'],
  ]),
  ...createItems('Argentina', 'desserts', [
    ['alfajores', 'Dulce de Leche Alfajores', 7.5, 'Delicate, crumbly shortbread cookies sandwiched together with a generous layer of sweet dulce de leche.', ['Flour', 'Dulce de Leche', 'Coconut'], 350, '🍪', ['sweet', 'vegetarian'], ['espresso'], 'veg', 'Alfajor'],
  ]),
];

// Read existing menu
const raw = fs.readFileSync(path.join(__dirname, 'public/js/menu-data.js'), 'utf-8');

// Use simple string matching to extract the array, append, and rewrite.
const startIdx = raw.indexOf('[');
const endIdx = raw.lastIndexOf(']');
const existingArr = JSON.parse(raw.substring(startIdx, endIdx + 1));

// Filter out items that are already there to avoid duplicates
const existingIds = new Set(existingArr.map(i => i.id));
let added = 0;
for (const item of newItems) {
  if (!existingIds.has(item.id)) {
    // Remove wikiPage from actual DB, keep it in an export for download script
    existingArr.push(item);
    added++;
  }
}

// Write back to public/js/menu-data.js
const newContent = `// Static Fallback Menu Data for 100% Offline & Universal Hosting\nexport const STATIC_MENU_ITEMS = ` + JSON.stringify(existingArr, null, 2) + `;\n`;

fs.writeFileSync(path.join(__dirname, 'public/js/menu-data.js'), newContent);
fs.writeFileSync(path.join(__dirname, 'js/menu-data.js'), newContent);

// Save mapping for downloader
const wikiMap = {};
for (const item of newItems) {
  if (item.wikiPage) {
    wikiMap[item.id] = item.wikiPage;
  }
}
fs.writeFileSync(path.join(__dirname, 'scripts/new-items-wiki.json'), JSON.stringify(wikiMap, null, 2));

console.log(`Added ${added} new menu items! Total is now ${existingArr.length}`);
