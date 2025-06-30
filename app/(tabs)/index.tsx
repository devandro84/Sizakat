import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Home, User, Settings, Calendar, CreditCard, FileText } from 'lucide-react-native';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to SiZakat</Text>
        <Text style={styles.headerSubtitle}>Aplikasi Pengelolaan Zakat</Text>
      </View>

      <View style={styles.menuGrid}>
        <MenuItem 
          title="Zakat Fitrah" 
          icon={<CreditCard size={24} color="#16a34a" />} 
        />
        <MenuItem 
          title="Zakat Mal" 
          icon={<FileText size={24} color="#16a34a" />} 
        />
        <MenuItem 
          title="Zakat Penghasilan" 
          icon={<Calendar size={24} color="#16a34a" />} 
        />
        <MenuItem 
          title="Laporan" 
          icon={<FileText size={24} color="#16a34a" />} 
        />
        <MenuItem 
          title="Penerima Zakat" 
          icon={<User size={24} color="#16a34a" />} 
        />
        <MenuItem 
          title="Pengaturan" 
          icon={<Settings size={24} color="#16a34a" />} 
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Ringkasan Zakat</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Muzakki:</Text>
          <Text style={styles.summaryValue}>120 Keluarga</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Zakat Uang:</Text>
          <Text style={styles.summaryValue}>Rp 15.000.000</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Zakat Beras:</Text>
          <Text style={styles.summaryValue}>350 kg</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function MenuItem({ title, icon }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#16a34a',
  },
  header: {
    padding: 20,
    backgroundColor: '#16a34a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 10,
  },
  menuItem: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  summaryCard: {
    margin: 15,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#16a34a',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});