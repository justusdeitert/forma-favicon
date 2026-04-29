<?php

/**
 * ICO file generator using GD.
 *
 * Combines multiple PNG sizes into a single .ico file.
 *
 * @package FormaFavicon
 */

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Generate an ICO file from existing PNG favicons.
 *
 * @param string $dir_path Absolute path to the favicon directory.
 */
function forma_favicon_generate_ico($dir_path) {
    $ico_sizes = [
        $dir_path . '/favicon-32x32.png' => 32,
        $dir_path . '/favicon-48x48.png' => 48,
    ];

    // Generate a 16px version internally for the ICO (no standalone PNG needed).
    $source_32 = $dir_path . '/favicon-32x32.png';
    $ico_16_path = null;

    if (file_exists($source_32)) {
        $src = @imagecreatefromstring(file_get_contents($source_32));

        if ($src) {
            $resized = imagecreatetruecolor(16, 16);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
            imagefill($resized, 0, 0, $transparent);
            imagecopyresampled($resized, $src, 0, 0, 0, 0, 16, 16, imagesx($src), imagesy($src));
            $ico_16_path = $dir_path . '/favicon-16x16-ico.png';
            imagepng($resized, $ico_16_path);
            imagedestroy($src);
            imagedestroy($resized);
            $ico_sizes = [$ico_16_path => 16] + $ico_sizes;
        }
    }

    $images = [];

    foreach ($ico_sizes as $file => $size) {
        if (! file_exists($file)) {
            continue;
        }

        $png_data = file_get_contents($file);

        if ($png_data === false) {
            continue;
        }

        $im = @imagecreatefromstring($png_data);

        if (! $im) {
            continue;
        }

        $resized = imagecreatetruecolor($size, $size);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
        imagefill($resized, 0, 0, $transparent);
        imagecopyresampled($resized, $im, 0, 0, 0, 0, $size, $size, imagesx($im), imagesy($im));

        ob_start();
        imagepng($resized);
        $png_content = ob_get_clean();

        $images[] = [
            'size' => $size,
            'data' => $png_content,
        ];

        imagedestroy($im);
        imagedestroy($resized);
    }

    if (empty($images)) {
        return;
    }

    $icon_dir_count = count($images);
    $offset = 6 + (16 * $icon_dir_count);
    $ico = pack('vvv', 0, 1, $icon_dir_count);
    $data_sections = '';

    foreach ($images as $img) {
        $size = $img['size'] >= 256 ? 0 : $img['size'];
        $data_len = strlen($img['data']);
        $ico .= pack('CCCCvvVV', $size, $size, 0, 0, 1, 32, $data_len, $offset);
        $data_sections .= $img['data'];
        $offset += $data_len;
    }

    $ico .= $data_sections;
    file_put_contents($dir_path . '/favicon.ico', $ico);

    // Clean up temporary 16px file.
    if ($ico_16_path && file_exists($ico_16_path)) {
        wp_delete_file($ico_16_path);
    }
}
