import React, { useContext } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import DividendContext from "../../context/dividend/dividendContext";

const DividendList = ({ dividends, onEditDividend }) => {
  const dividendContext = useContext(DividendContext);
  const { deleteDividend } = dividendContext;

  const listHeader = (
    <Box
      sx={{
        display: "flex",
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "grey.100",
      }}
    >
      <Typography sx={{ flex: 3, fontWeight: "bold" }} variant="subtitle2">
        日期
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "right" }} variant="subtitle2">
        金額
      </Typography>
      <Typography sx={{ flex: 2, textAlign: "center" }} variant="subtitle2">
        操作
      </Typography>
    </Box>
  );

  return (
    <>
      {listHeader}
      <List disablePadding sx={{ maxHeight: "50vh", overflow: "auto" }}>
        {dividends.map((dividend) => (
          <ListItem key={dividend._id} divider>
            <Typography variant="body2" sx={{ flex: 3 }}>
              {format(new Date(dividend.date), "yyyy-MM-dd")}
            </Typography>
            <ListItemText
              sx={{
                flex: 2,
                textAlign: "right",
                color: "green",
              }}
              primary={`${dividend.amount.toLocaleString()}`}
            />
            <Box sx={{ flex: 2, textAlign: "center" }}>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEditDividend(dividend)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteDividend(dividend._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default DividendList;
