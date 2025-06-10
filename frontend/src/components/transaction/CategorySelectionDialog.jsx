import React, { useState, useContext, useEffect } from "react";
import CategoryContext from "../../context/category/categoryContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { ExpandLess, ExpandMore, Add as AddIcon } from "@mui/icons-material";
import { getIconComponent } from "../../utils/iconMapping";

const CategorySelectionDialog = ({
  open,
  onClose,
  onSelect,
  transactionType,
}) => {
  const categoryContext = useContext(CategoryContext);
  const { categories, loading, getCategories, addCategory, addSubcategory } =
    categoryContext;

  const [openCategory, setOpenCategory] = useState(null);
  const [addingSubcategory, setAddingSubcategory] = useState(null); // state to track which category is adding sub
  const [newSubcategory, setNewSubcategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (open) {
      getCategories();
    }
  }, [open, getCategories]);

  useEffect(() => {
    if (categories) {
      const filtered = categories.filter((category) => {
        if (transactionType === "income") {
          return category.name === "收入";
        }
        return category.name !== "收入";
      });
      setFilteredCategories(filtered);
    }
  }, [categories, transactionType]);

  const handleCategoryClick = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const handleSubcategorySelect = (category, subcategory) => {
    onSelect(category.name, subcategory);
    onClose();
    setOpenCategory(null);
  };

  const handleAddSubcategory = async (categoryId) => {
    if (newSubcategory.trim() === "") return;
    await addSubcategory(categoryId, newSubcategory);
    setNewSubcategory("");
    setAddingSubcategory(null);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;
    await addCategory(newCategory);
    setNewCategory("");
    setAddingCategory(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>選擇分類</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List component="nav">
            {filteredCategories
              .filter((cat) => cat.name !== "帳戶轉帳")
              .map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <React.Fragment key={category._id}>
                    <ListItem>
                      <ListItemIcon>
                        <IconComponent />
                      </ListItemIcon>
                      <ListItemText
                        primary={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        sx={{ cursor: "pointer" }}
                      />
                      <IconButton
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        {openCategory === category.name ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </ListItem>
                    <Collapse
                      in={openCategory === category.name}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {category.subcategories.map((subcategory) => (
                          <ListItem
                            key={subcategory}
                            button
                            sx={{ pl: 4 }}
                            onClick={() =>
                              handleSubcategorySelect(category, subcategory)
                            }
                          >
                            <ListItemText primary={subcategory} />
                          </ListItem>
                        ))}
                        <ListItem sx={{ pl: 4, pt: 1 }}>
                          {addingSubcategory === category._id ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <TextField
                                autoFocus
                                size="small"
                                label="新細項"
                                value={newSubcategory}
                                onChange={(e) =>
                                  setNewSubcategory(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  handleAddSubcategory(category._id)
                                }
                              />
                              <Button
                                onClick={() =>
                                  handleAddSubcategory(category._id)
                                }
                              >
                                新增
                              </Button>
                              <Button
                                onClick={() => setAddingSubcategory(null)}
                              >
                                取消
                              </Button>
                            </Box>
                          ) : (
                            <Button
                              startIcon={<AddIcon />}
                              onClick={() => setAddingSubcategory(category._id)}
                            >
                              新增項目
                            </Button>
                          )}
                        </ListItem>
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              })}
            <ListItem>
              {addingCategory ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <TextField
                    autoFocus
                    size="small"
                    label="新主分類"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <Button onClick={handleAddCategory}>新增</Button>
                  <Button onClick={() => setAddingCategory(false)}>取消</Button>
                </Box>
              ) : (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setAddingCategory(true)}
                >
                  新增主分類
                </Button>
              )}
            </ListItem>
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategorySelectionDialog;
