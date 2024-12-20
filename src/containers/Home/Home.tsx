import { useCallback, useEffect, useState } from "react";
import { IPost, IPostAPI } from "../../types";
import axiosAPI from "../../axiosAPI.ts";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { NavLink } from "react-router-dom";
import Loader from "../../UI/Loader/Loader.tsx";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response: { data: IPostAPI } =
        await axiosAPI<IPostAPI>("posts.json");

      if (response.data) {
        const postFromApi = Object.keys(response.data).map((postKey) => {
          return {
            ...response.data[postKey],
            id: postKey,
          };
        });
        setPosts(postFromApi);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Typography
        variant="h4"
        sx={{ mb: 2, textAlign: "center", color: "#000" }}
      >
        Posts
      </Typography>
      {posts.length === 0 ? (
        <Alert severity="info">
          There are no posts yet! Go to the "Add" page to add a new post
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid size={12} key={post.id}>
              <Card
                sx={{
                  minWidth: 275,
                  backgroundColor: "inherit",
                  border: "3px solid",
                  borderRadius: "10px",
                  p: 1,
                }}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{ fontSize: 16, textDecoration: "underline" }}
                  >
                    {post.date}
                  </Typography>
                </CardContent>
                <CardContent
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid  #9e9e9e",
                    borderRadius: "10px",
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                    {post.title}
                  </Typography>
                  <hr />
                  <Typography sx={{ fontSize: 16 }}>
                    {post.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    component={NavLink}
                    to={`/posts/${post.id}`}
                    variant="contained"
                    size="medium"
                  >
                    Read more...
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Home;
