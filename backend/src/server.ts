app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  // Khởi tạo các service nền
  await initElasticsearch();
  initWorker();
});
