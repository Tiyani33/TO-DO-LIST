app.use(cors({
    origin: 'http://localhost:3000', // Or whatever port your frontend uses
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));