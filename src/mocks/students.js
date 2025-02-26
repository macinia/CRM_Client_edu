import { http, HttpResponse } from "msw";

export const studentHandlers = [
  http.get("/api/v1/students", () => {
    return HttpResponse.json({
      content: [
        {
          id: 1,
          surname: "Иванов",
          name: "Иван",
          patronymic: "Иванович",
          email: "ivan.ivanov@example.com",
          phone: "+79991234567",
          timezone: "+3",
          hex: "#F2F2D7",
          birthDate: "2000-05-15",
          grade: 5,
          balance: 1000,
          status: "ACTIVE",
        },
      ],
      page: 0,
      limit: 0,
      totalCount: 0,
      totalPages: 0,
    });
  }),
  http.get("/students", () => {
    return HttpResponse.json([]);
  }),
];
