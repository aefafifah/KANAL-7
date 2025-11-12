import { useState, useEffect } from 'react';

import { ScrollView, HStack, Heading, Text, Box, Spinner } from '@gluestack-ui/themed';

// --- 1. KITA TETAP PAKAI 'NewsCard' ---

import NewsCard from '../../components/NewsCard'; // Path yang sudah benar



const NewsScreen = () => {

  const [articles, setArticles] = useState([]); // Kita sebut 'articles' agar konsisten

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    const fetchDrinksAsNews = async () => {

      setLoading(true);

      setError(null);

      try {

        // --- 2. AMBIL DATA DARI API MINUMAN (GRATIS, TANPA KUNCI) ---

        const response = await fetch(

          `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`

        );

        const data = await response.json();



        if (data && data.drinks) {

          // --- 3. INI BAGIAN PENTING: UBAH FORMAT DATA MINUMAN ---

          // Kita 'map' (ubah) data.drinks agar cocok dengan 'NewsCard'

          const formattedNews = data.drinks.map(drink => {

            return {

              // 'NewsCard' butuh 'title', kita beri 'strDrink'

              title: drink.strDrink,

             

              // 'NewsCard' butuh 'urlToImage', kita beri 'strDrinkThumb'

              urlToImage: drink.strDrinkThumb,

             

              // 'NewsCard' butuh 'source.name', kita beri teks statis

              source: { name: "Inspirasi Minuman" },

             

              // 'NewsCard' butuh 'description', kita beri teks statis

              description: `Klik untuk melihat resep ${drink.strDrink}.`,

             

              // 'NewsCard' butuh 'url', kita buat link ke resepnya

              url: `https://www.thecocktaildb.com/drink/${drink.idDrink}`

            };

          });

         

          setArticles(formattedNews); // Simpan data yang sudah diformat

        } else {

          setError('Gagal mengambil data minuman');

        }

      } catch (err) {

        console.error("Error fetching data:", err);

        setError('Terjadi kesalahan jaringan.');

      } finally {

        setLoading(false);

      }

    };



    fetchDrinksAsNews();

  }, []); // Hanya panggil sekali



  if (loading) {

    return (

      <Box flex={1} justifyContent="center" alignItems="center" bg="$gray50">

        <Spinner size="large" color="$blue500" />

        <Text mt="$2" color="$gray600">Mencari inspirasi minuman...</Text>

      </Box>

    );

  }



  if (error) {

    return (

      <Box flex={1} justifyContent="center" alignItems="center" p="$4" bg="$gray50">

        <Text color="$red500" textAlign="center">Error: {error}</Text>

      </Box>

    );

  }



  if (articles.length === 0) {

    return (

      <Box flex={1} justifyContent="center" alignItems="center" p="$4" bg="$gray50">

        <Text color="$gray600">Tidak ada inspirasi yang ditemukan.</Text>

      </Box>

    );

  }



  return (

    <ScrollView bg="$gray50">

      <Heading p="$4" pb="$0">Inspirasi Minuman</Heading>

     

      {/* 4. KITA TETAP MENGGUNAKAN 'NewsCard' DAN 'articles' */}

      {articles[0] && <NewsCard post={articles[0]} size="large" />}



      {articles.length >= 3 && (

        <HStack>

          <NewsCard post={articles[1]} size="small" />

          <NewsCard post={articles[2]} size="small" />

        </HStack>

      )}

     

      {articles.slice(3).map((article, index) => (

        <NewsCard key={article.url + index} post={article} size="large" />

      ))}



    </ScrollView>

  );

};



export default NewsScreen;