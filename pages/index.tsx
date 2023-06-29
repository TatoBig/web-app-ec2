import { PrismaClient } from "@prisma/client";
import { Bar } from "react-chartjs-2";
import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/router";
import { userQuery } from "@/utils/SqlQueries";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const getServerSideProps = async () => {
  const prisma = new PrismaClient();
  const postCount = await prisma.post.count();
  const userCount = await prisma.user.count();

  const users =
    await prisma.$queryRaw`SELECT time_slots.time_slot, COUNT(user.created_at) AS post_count
  FROM (
      SELECT DISTINCT DATE_FORMAT(
          DATE_SUB(NOW(), INTERVAL (units.a + tens.a + hundreds.a + thousands.a) MINUTE),
          '%Y-%m-%d %H:%i'
      ) AS time_slot
      FROM (
          SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
      ) units
      CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 10 UNION ALL SELECT 20 UNION ALL SELECT 30 UNION ALL SELECT 40 UNION ALL SELECT 50) tens
      CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 100) hundreds
      CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1000) thousands
      WHERE (units.a + tens.a + hundreds.a + thousands.a) <= 60
  ) AS time_slots
  LEFT JOIN user ON DATE_FORMAT(user.created_at, '%Y-%m-%d %H:%i') = time_slots.time_slot
  GROUP BY time_slots.time_slot
  ORDER BY time_slots.time_slot DESC;`;

  const posts =
    await prisma.$queryRaw`SELECT time_slots.time_slot, COUNT(post.created_at) AS post_count
        FROM (
            SELECT DISTINCT DATE_FORMAT(
                DATE_SUB(NOW(), INTERVAL (units.a + tens.a + hundreds.a + thousands.a) MINUTE),
                '%Y-%m-%d %H:%i'
            ) AS time_slot
            FROM (
                SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
            ) units
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 10 UNION ALL SELECT 20 UNION ALL SELECT 30 UNION ALL SELECT 40 UNION ALL SELECT 50) tens
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 100) hundreds
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1000) thousands
            WHERE (units.a + tens.a + hundreds.a + thousands.a) <= 60
        ) AS time_slots
        LEFT JOIN post ON DATE_FORMAT(post.created_at, '%Y-%m-%d %H:%i') = time_slots.time_slot
        GROUP BY time_slots.time_slot
        ORDER BY time_slots.time_slot DESC;`;

  return {
    props: {
      postCount: JSON.parse(JSON.stringify(postCount)),
      userCount: JSON.parse(JSON.stringify(userCount)),
      posts: JSON.parse(JSON.stringify(posts)).reverse(),
      users: JSON.parse(JSON.stringify(users)).reverse(),
    },
  };
};

const Home = ({ postCount, userCount, posts, users }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const router = useRouter();

  useEffect(() => {
    setInterval(() => {
      router.replace(router.asPath);
    }, 700);
  }, []);

  const data = {
    labels: users.map((time) => time.time_slot),
    datasets: [
      {
        label: "Usuarios ingresados por minuto",
        data: users.map((time) => time.post_count),
        backgroundColor: "rgb(255, 69, 0)",
      },
      {
        label: "Publicaciones ingresadas por minuto",
        data: posts.map((time) => time.post_count),
        backgroundColor: "rgb(65,105,225)",
      },
    ],
  };
  return (
    <div className="bg-orange-50 w-screen max-w-full h-screen flex justify-center items-center">
      <div className="border border-black p-4 rounded flex flex-col">
        <div className="border border-black p-4 rounded flex flex-col text-3xl w-[1200px]">
          <h1>Datos ingresados por minuto</h1>
          <div className="w-full h-px bg-black my-4" />
          <Bar options={options} data={data} />
        </div>
        <div className="flex">
          <div className="border border-black p-4 rounded m-2">
            <h1 className="text-3xl">Usuarios</h1>
            <div className="w-full h-px bg-black my-4" />
            <h2>
              Datos actuales: <strong>{userCount}</strong> <br />
              Ingresadas en el último minuto: <strong>{users[users.length - 1].post_count}</strong>
            </h2>
          </div>
          <div className="border border-black p-4 rounded m-2">
            <h1 className="text-3xl">Publicaciones</h1>
            <div className="w-full h-px bg-black my-4" />
            <h2>
              Datos actuales: <strong>{postCount}</strong> <br />
              Ingresados en el último minuto: <strong>{posts[posts.length - 1].post_count}</strong>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
