import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import moment from "moment";

const RecentTransactions = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography>沒有最近的交易紀錄</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ maxHeight: 300, overflow: "auto", padding: 0 }}>
      {transactions.map((t, index) => (
        <React.Fragment key={t._id}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {t.category}
                  </Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {t.accountId.name}
                  </Typography>
                </React.Fragment>
              }
              secondary={moment(t.date).format("YYYY-MM-DD")}
            />
            <Typography
              variant="body1"
              color={t.amount > 0 ? "green" : "red"}
              sx={{ fontWeight: "bold" }}
            >
              {t.amount.toLocaleString()}
            </Typography>
          </ListItem>
          {index < transactions.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentTransactions;
