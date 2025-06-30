import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <User size={40} color="#16a34a" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>Ahmad Muzakki</Text>
        <Text style={styles.role}>Admin Zakat</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Mail size={20} color="#16a34a" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>ahmad@example.com</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <Phone size={20} color="#16a34a" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>+62 812 3456 7890</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <MapPin size={20} color="#16a34a" style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>Jl. Masjid No. 123, Jakarta</Text>
          </View>
        </View>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Collected zakat from Budi</Text>
            <Text style={styles.activityTime}>Today, 10:30 AM</Text>
          </View>
        </View>
        
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Updated recipient data</Text>
            <Text style={styles.activityTime}>Yesterday, 3:45 PM</Text>
          </View>
        </View>
        
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Generated monthly report</Text>
            <Text style={styles.activityTime}>May 15, 2023</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#16a34a',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  infoCard: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activityCard: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16a34a',
    marginTop: 5,
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    margin: 15,
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});