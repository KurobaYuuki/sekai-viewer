import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { IEventInfo } from "../../types.d";
import { getRemoteAssetURL } from "../../utils";
import { useAssetI18n } from "../../utils/i18n";
import { ContentTrans } from "../../components/helpers/ContentTrans";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/root";
import CardMediaCardImg from "../../components/styled/CardMediaCardImg";
import SpoilerCard from "../../components/helpers/SpoilerCard";

const GridView: React.FC<{ data?: IEventInfo }> = observer(({ data }) => {
  const { t } = useTranslation();
  const { getTranslated } = useAssetI18n();
  const { path } = useRouteMatch();
  const { region } = useRootStore();

  const [eventLogo, setEventLogo] = useState<string>("");

  useEffect(() => {
    if (data) {
      getRemoteAssetURL(
        `event/${data.assetbundleName}/logo_rip/logo.webp`,
        setEventLogo,
        "minio",
        region
      );
    }
  }, [data, region]);

  if (!data) {
    // loading
    return (
      <Card>
        <Skeleton
          variant="rectangular"
          sx={{
            backgroundSize: "contain",
            paddingTop: "56.25%",
            position: "relative",
          }}
        ></Skeleton>
        <CardContent>
          <Typography variant="subtitle1">
            <Skeleton variant="text" width="90%"></Skeleton>
          </Typography>
          <Typography variant="body2">
            <Skeleton variant="text" width="40%"></Skeleton>
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <SpoilerCard
      releaseTime={new Date(data.startAt)}
      toPath={path + "/" + data.id}
    >
      <CardMediaCardImg
        sx={{ backgroundSize: "contain" }}
        image={eventLogo}
        title={getTranslated(`event_name:${data.id}`, data.name)}
      />
      <CardContent style={{ paddingBottom: "16px" }}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <ContentTrans
              contentKey={`event_name:${data.id}`}
              original={data.name}
              originalProps={{
                variant: "subtitle1",
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              {t(`event:type.${data.eventType}`)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(data.startAt).toLocaleString()} ~
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(data.aggregateAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </SpoilerCard>
  );
});

export default GridView;
