package com.ecommerce.backend.services;

import com.ecommerce.backend.models.Profile;
import com.ecommerce.backend.models.User;
import com.ecommerce.backend.repositories.ProfileRepository;
import com.ecommerce.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileRepository profileRepository;


    public boolean createOrUpdate(Long userId, MultipartFile avatar, String bio,String location,  String phone) {
        User user = userService.findById(userId);
        Profile userProfile = user.getProfile();

        String avatarPath = null;
        if (avatar != null && !avatar.isEmpty()) {
            avatarPath = saveAvatar(avatar);
        }

        if (userProfile == null) {
            Profile profile = new Profile();
            profile.setUser(user);
            profile.setAvatar(avatarPath);
            profile.setBio(bio);
            profile.setLocation(location);
            profile.setPhone(phone);
            profileRepository.save(profile);
            return true;
        } else {
            if (avatarPath != null) {
                userProfile.setAvatar(avatarPath);
            }
            userProfile.setBio(bio);
            userProfile.setLocation(location);
            userProfile.setPhone(phone);
            profileRepository.save(userProfile);
            return true;
        }
    }

    private String saveAvatar(MultipartFile file) {
    try {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String relativePath = "images/profiles/" + filename;
        Path destination = Paths.get(relativePath);

        Files.createDirectories(destination.getParent());

        // Save the file
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return relativePath;
    } catch (IOException e) {
        e.printStackTrace();
        return null;
    }
}
}
