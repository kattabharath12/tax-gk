
# Railway Volume Setup for TaxGrok

This guide explains how to set up persistent volume storage in Railway for the TaxGrok application.

## Why Volumes?

TaxGrok needs to store uploaded tax documents (PDFs, images of W2s, 1099s, etc.) and generated Form 1040 PDFs. Instead of using external object storage services like AWS S3 or Azure Blob Storage, we use Railway's persistent volume storage for a simpler, cost-effective solution.

## Setting Up a Volume in Railway

### Step 1: Create a Volume

1. Go to your Railway project dashboard
2. Click on your TaxGrok service
3. Navigate to the **"Variables"** or **"Settings"** tab
4. Look for the **"Volumes"** section
5. Click **"+ New Volume"**
6. Configure the volume:
   - **Mount Path**: `/data`
   - **Size**: Start with 1GB (you can increase later as needed)
7. Click **"Add"** or **"Create"**

### Step 2: Verify Environment Variables

Make sure the following environment variable is set:

```
UPLOAD_DIR=/data/uploads
```

This tells the application where to store uploaded files. The default is `/data/uploads` if not specified.

### Step 3: Deploy

After creating the volume:

1. Trigger a new deployment (Railway may do this automatically)
2. The application will automatically create the `/data/uploads` directory on first run
3. Verify in the deployment logs that you see: `✅ Created upload directory: /data/uploads`

## Volume Management

### Checking Volume Usage

You can check the volume usage in the Railway dashboard:

1. Go to your service
2. Click on the **"Volumes"** section
3. View the current usage and available space

### Increasing Volume Size

If you need more storage:

1. Go to the **"Volumes"** section in Railway
2. Click on your volume
3. Adjust the size slider
4. Save changes (may require a redeployment)

### Backing Up Files

**Important**: Railway volumes are persistent across deployments, but you should still maintain regular backups of important data.

To back up your files:

1. Use Railway's CLI to download files:
   ```bash
   railway run bash
   cd /data/uploads
   tar -czf backup.tar.gz *
   ```

2. Or use the Railway API to access and download files programmatically

### Volume Limitations

- **Persistence**: Files persist across deployments and restarts
- **Single Instance**: Volumes are mounted to a single container instance
- **Performance**: Local disk I/O is generally fast, but not as scalable as cloud object storage
- **Backups**: You are responsible for backing up important files

## Migration from Azure Blob Storage

If you previously used Azure Blob Storage, note that:

1. The application no longer requires Azure Storage credentials
2. Files are now stored locally in `/data/uploads` instead of cloud storage
3. The database still stores the same information, but `cloudStoragePath` now contains local filenames
4. You'll need to manually migrate existing files if you have any in Azure Blob Storage

## Troubleshooting

### "File upload failed" errors

- Check that the volume is properly mounted at `/data`
- Verify that `UPLOAD_DIR` environment variable is set correctly
- Check deployment logs for permission errors

### "No space left on device" errors

- Your volume is full
- Increase the volume size in Railway dashboard
- Clean up old/unnecessary files

### Files disappearing after deployment

- Ensure the volume mount path is correct (`/data`)
- Verify the volume is created in Railway
- Check that you're not using ephemeral storage (files outside `/data`)

## Cost Considerations

Railway volume pricing:

- Volumes are charged based on GB/month
- Starting with 1GB is usually sufficient for testing
- Monitor usage and scale as needed
- Much more cost-effective than external object storage for small to medium applications

## Best Practices

1. **Set Reasonable Volume Size**: Start small and scale as needed
2. **Monitor Disk Usage**: Regularly check volume usage in Railway dashboard
3. **Implement File Cleanup**: Consider adding a cleanup job for old/unused files
4. **Backup Important Data**: Regularly backup critical tax documents
5. **Add File Size Limits**: The app limits uploads to 10MB per file (configurable)
6. **Log File Operations**: The app logs all upload/download/delete operations for debugging

## Support

For Railway-specific volume issues, refer to:
- [Railway Documentation](https://docs.railway.app/reference/volumes)
- [Railway Discord](https://discord.gg/railway)

For TaxGrok application issues, check the application logs and documentation.
