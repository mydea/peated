import { AddBox as AddIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import BrandSelect from "../components/brandSelect";
import { FormEvent, useState } from "react";

import DistillerSelect from "../components/distillerSelect";
import { Brand, Distiller } from "../types";
import api from "../lib/api";
import { useRequiredAuth } from "../hooks/useAuth";
import Layout from "../components/layout";

function toTitleCase(value: string) {
  var words = value.toLowerCase().split(" ");
  for (var i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }
  return words.join(" ");
}

type FormData = {
  name?: string;
  series?: string;
  brand?: Brand;
  distiller?: Distiller;
  abv?: number;
  statedAge?: number;
  category?: string;
};

export default function AddBottle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useRequiredAuth();

  const qs = new URLSearchParams(location.search);
  const name = qs.get("name") || "";

  const [formData, setFormData] = useState<FormData>({
    name,
    series: "",
    category: "",
  });

  const categoryList = [
    "blend",
    "blended_grain",
    "blended_malt",
    "blended_scotch",
    "bourbon",
    "rye",
    "single_grain",
    "single_malt",
    "spirit",
  ].map((c) => ({
    id: c,
    name: toTitleCase(c.replace("_", " ")),
  }));

  const onSubmit = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();

    (async () => {
      const bottle = await api.post("/bottles", { data: formData });
      navigate(`/b/${bottle.id}/checkin`);
    })();
  };

  return (
    <Layout
      title="Add Bottle"
      onClose={() => {
        navigate(-1);
      }}
      onSave={onSubmit}
    >
      <Box component="form" onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bottle"
              name="name"
              placeholder="e.g. Macallan 12"
              variant="outlined"
              required
              helperText="The full name of the bottle, excluding its series."
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              defaultValue={formData.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Series"
              name="series"
              placeholder="e.g. The Edition"
              variant="outlined"
              helperText="If applicable, the series of bottling."
              onChange={(e) =>
                setFormData({ ...formData, series: e.target.value })
              }
              defaultValue={formData.series}
            />
          </Grid>
          <Grid item xs={12}>
            <BrandSelect
              onChange={(value: any) =>
                setFormData({ ...formData, brand: value })
              }
              canCreate={user.admin}
            />
          </Grid>
          <Grid item xs={12}>
            <DistillerSelect
              onChange={(value: any) =>
                setFormData({ ...formData, distiller: value })
              }
              canCreate={user.admin}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ABV"
              required
              placeholder="e.g. 45"
              name="abv"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              variant="outlined"
              helperText="The alcohol content by volume."
              onChange={(e) =>
                setFormData({ ...formData, abv: parseInt(e.target.value, 10) })
              }
              defaultValue={formData.abv}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Stated Age"
              placeholder="e.g. 12"
              name="statedAge"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">years</InputAdornment>
                ),
              }}
              variant="outlined"
              helperText="If applicable, the number of years the spirit was aged."
              onChange={(e) =>
                setFormData({
                  ...formData,
                  statedAge: parseInt(e.target.value, 10),
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                fullWidth
                name="category"
                variant="outlined"
                labelId="category-label"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                renderValue={(value) =>
                  categoryList.find((v) => value === v.id)?.name || "Unknown"
                }
                value={formData.category}
                required
              >
                <MenuItem key="" value="">
                  <em>Unknown</em>
                </MenuItem>
                {categoryList.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>The kind of spirit.</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
