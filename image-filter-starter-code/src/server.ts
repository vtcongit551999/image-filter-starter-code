import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL,filterImageFromURLV2, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    try {
      const {image_url} = req.query;
      // const image_url = queryString.image_url;
      const isValidUrl = new URL(image_url as string);

      console.log(typeof image_url);
      console.log(typeof isValidUrl);

      if (!image_url) {
        console.log("go in");
        
        return res.status(400)
          .send("Url is required");
      }
      const path = await filterImageFromURL(req.query.image_url);
      res.sendFile(path, function(){
        deleteLocalFiles([image_url as string]);
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(401).json({ message: err.message });
      }
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();