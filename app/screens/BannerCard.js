import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const BannerCard = React.memo(({ banner, onPress }) => {
  const thumbnailUrl = banner.bannerUrls.length > 0 ? banner.bannerUrls[0] : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.date}>{new Date(banner.date).toLocaleDateString()}</Text>
        <Text style={styles.nameOfSite}>{banner.nameOfSite}</Text>
        <Text style={styles.dimensions}>{banner.dimensions}</Text>
      </View>
      {thumbnailUrl && (
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
        />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 16,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  nameOfSite: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  dimensions: {
    fontSize: 16,
    color: '#555',
  },
});

export default BannerCard;