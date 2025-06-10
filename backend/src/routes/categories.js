const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// Define default categories directly in the backend route
const defaultCategories = [
    { name: "飲食", icon: "Restaurant", subcategories: ["早餐", "午餐", "晚餐", "飲料", "零食", "食材"] },
    { name: "交通", icon: "Commute", subcategories: ["捷運", "公車", "計程車", "火車", "高鐵", "油錢", "停車費"] },
    { name: "娛樂", icon: "SportsEsports", subcategories: ["電影", "遊戲", "KTV", "展覽", "運動", "旅遊"] },
    { name: "購物", icon: "ShoppingCart", subcategories: ["服飾", "電子產品", "書籍", "美妝保養", "家具"] },
    { name: "個人", icon: "Person", subcategories: ["理髮", "學習", "社交", "寵物"] },
    { name: "醫療", icon: "MedicalServices", subcategories: ["看診", "藥品", "保健食品"] },
    { name: "家居", icon: "Home", subcategories: ["房租", "水電瓦斯", "網路費", "日用品", "維修"] },
    { name: "生活", icon: "ReceiptLong", subcategories: ["電話費", "慈善", "紅白包"] },
    { name: "手續費", icon: "Payment", subcategories: ["銀行手續費", "交易手續費"] },
    { name: "其他", icon: "HelpOutline", subcategories: ["雜項"] },
    { name: "收入", icon: "AttachMoney", subcategories: ["薪資", "獎金", "投資收入", "兼職"] },
];

// @route   GET api/categories
// @desc    Get all categories for a user. If none, create default ones.
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let userCategories = await Category.find({ userId: req.user.id });

    // If user has no categories, create default set for them
    if (userCategories.length === 0) {
      const categoriesToCreate = defaultCategories.map(cat => ({
        ...cat,
        userId: req.user.id,
        isDefault: true,
      }));
      userCategories = await Category.insertMany(categoriesToCreate);
    } else {
      // For existing users, check if their default categories have correct icons.
      // This is a one-time migration for users with old data.
      const defaultCategoriesMap = new Map(defaultCategories.map(cat => [cat.name, cat.icon]));
      const updatePromises = [];

      userCategories.forEach(cat => {
        if (cat.isDefault && defaultCategoriesMap.has(cat.name) && cat.icon !== defaultCategoriesMap.get(cat.name)) {
          cat.icon = defaultCategoriesMap.get(cat.name);
          updatePromises.push(cat.save());
        }
      });
      
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        // Re-fetch to get the updated documents
        userCategories = await Category.find({ userId: req.user.id });
      }
    }
    
    res.json(userCategories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Add a new main category
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, subcategories, icon } = req.body;

  try {
    const newCategory = new Category({
      name,
      icon, // Let the model handle the default if icon is not provided
      subcategories: subcategories || [],
      userId: req.user.id,
      isDefault: false,
    });

    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    if (err.code === 11000) {
        return res.status(400).json({ msg: '此分類名稱已存在' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories/:id/subcategories
// @desc    Add a new subcategory to a main category
// @access  Private
router.post('/:id/subcategories', auth, async (req, res) => {
    const { subcategory } = req.body;

    if (!subcategory) {
        return res.status(400).json({ msg: '子分類名稱為必填' });
    }

    try {
        const category = await Category.findOne({ _id: req.params.id, userId: req.user.id });

        if (!category) {
            return res.status(404).json({ msg: '找不到該主分類' });
        }
        
        if (category.subcategories.includes(subcategory)) {
            return res.status(400).json({ msg: '此子分類已存在' });
        }

        category.subcategories.push(subcategory);
        await category.save();

        res.json(category);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router; 